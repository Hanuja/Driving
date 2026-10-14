<?php
require_once 'AuthController.php';

class BookingController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest($method, $id, $input) {
        AuthController::requireAuth(); // All booking endpoints are protected

        if ($method === 'GET') {
            if ($id) {
                $this->getBooking($id);
            } else {
                $this->getBookings();
            }
        } elseif ($method === 'POST') {
            $this->createBooking($input);
        } elseif ($method === 'PUT') {
            if ($id) {
                $this->updateBooking($id, $input);
            } else {
                jsonResponse(false, 'Booking ID is required', null, 400);
            }
        } elseif ($method === 'DELETE') {
            if ($id) {
                $this->deleteBooking($id);
            } else {
                jsonResponse(false, 'Booking ID is required', null, 400);
            }
        } else {
            jsonResponse(false, 'Method not allowed', null, 405);
        }
    }

    private function getBookings() {
        try {
            $query = "SELECT b.*, 
                             s.name as student_name, 
                             s.email as student_email,
                             s.phone as student_phone,
                             s.student_id as student_code,
                             c.name as course_name, 
                             i.name as instructor_name, 
                             v.vehicle_number 
                      FROM bookings b
                      LEFT JOIN students s ON b.student_id = s.id
                      LEFT JOIN courses c ON b.course_id = c.id
                      LEFT JOIN instructors i ON b.instructor_id = i.id
                      LEFT JOIN vehicles v ON b.vehicle_id = v.id
                      ORDER BY b.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, 'Bookings retrieved successfully', $bookings);
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function getBooking($id) {
        try {
            $query = "SELECT b.*, 
                             s.name as student_name, 
                             s.email as student_email,
                             s.phone as student_phone,
                             s.student_id as student_code,
                             c.name as course_name, 
                             c.duration as course_duration,
                             c.type as course_type,
                             i.name as instructor_name,
                             i.phone as instructor_phone, 
                             v.vehicle_number,
                             v.vehicle_type,
                             v.transmission as vehicle_transmission
                      FROM bookings b
                      LEFT JOIN students s ON b.student_id = s.id
                      LEFT JOIN courses c ON b.course_id = c.id
                      LEFT JOIN instructors i ON b.instructor_id = i.id
                      LEFT JOIN vehicles v ON b.vehicle_id = v.id
                      WHERE b.id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $booking = $stmt->fetch(PDO::FETCH_ASSOC);
                jsonResponse(true, 'Booking retrieved successfully', $booking);
            } else {
                jsonResponse(false, 'Booking not found', null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function generateBookingId() {
        return 'BK-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -4));
    }

    private function checkConflict($date, $start, $end, $field, $value, $exclude_id = null) {
        $query = "SELECT id FROM bookings 
                  WHERE $field = :val 
                  AND booking_date = :date 
                  AND (start_time < :end AND end_time > :start)";
        
        $params = [
            ':val' => $value,
            ':date' => $date,
            ':start' => $start,
            ':end' => $end
        ];

        if ($exclude_id) {
            $query .= " AND id != :exclude_id";
            $params[':exclude_id'] = $exclude_id;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    private function createBooking($input) {
        // Validation
        if (empty($input['student_id']) || empty($input['course_id']) || empty($input['instructor_id']) || 
            empty($input['vehicle_id']) || empty($input['booking_date']) || empty($input['start_time']) || empty($input['end_time'])) {
            jsonResponse(false, 'All required fields (student, course, instructor, vehicle, date, time) must be provided', null, 422);
        }

        try {
            // Check conflicts
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'instructor_id', $input['instructor_id'])) {
                jsonResponse(false, 'This instructor is already booked for the selected time', null, 409);
            }
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'vehicle_id', $input['vehicle_id'])) {
                jsonResponse(false, 'This vehicle is already assigned to another booking for the selected time', null, 409);
            }
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'student_id', $input['student_id'])) {
                jsonResponse(false, 'This student already has a booking at the selected time', null, 409);
            }

            $query = "INSERT INTO bookings 
                (booking_id, student_id, course_id, instructor_id, vehicle_id, booking_date, start_time, end_time, course_fee, paid_amount, payment_status, status) 
                VALUES 
                (:booking_id, :student_id, :course_id, :instructor_id, :vehicle_id, :booking_date, :start_time, :end_time, :course_fee, :paid_amount, :payment_status, :status)";
            
            $stmt = $this->conn->prepare($query);
            
            $booking_id = $this->generateBookingId();

            $stmt->execute([
                ':booking_id' => $booking_id,
                ':student_id' => $input['student_id'],
                ':course_id' => $input['course_id'],
                ':instructor_id' => $input['instructor_id'],
                ':vehicle_id' => $input['vehicle_id'],
                ':booking_date' => $input['booking_date'],
                ':start_time' => $input['start_time'],
                ':end_time' => $input['end_time'],
                ':course_fee' => $input['course_fee'] ?? 0,
                ':paid_amount' => $input['paid_amount'] ?? 0,
                ':payment_status' => $input['payment_status'] ?? 'Pending',
                ':status' => $input['status'] ?? 'Pending'
            ]);
            
            $id = $this->conn->lastInsertId();
            
            // Format ID nicely like BK001
            $updateId = "BK" . str_pad($id, 3, "0", STR_PAD_LEFT);
            $this->conn->prepare("UPDATE bookings SET booking_id = :bid WHERE id = :id")->execute([':bid' => $updateId, ':id' => $id]);

            jsonResponse(true, 'Booking created successfully', ['id' => $id, 'booking_id' => $updateId], 201);
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function updateBooking($id, $input) {
        // Validation
        if (empty($input['student_id']) || empty($input['course_id']) || empty($input['instructor_id']) || 
            empty($input['vehicle_id']) || empty($input['booking_date']) || empty($input['start_time']) || empty($input['end_time'])) {
            jsonResponse(false, 'All required fields (student, course, instructor, vehicle, date, time) must be provided', null, 422);
        }

        try {
            // Check conflicts
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'instructor_id', $input['instructor_id'], $id)) {
                jsonResponse(false, 'This instructor is already booked for the selected time', null, 409);
            }
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'vehicle_id', $input['vehicle_id'], $id)) {
                jsonResponse(false, 'This vehicle is already assigned to another booking for the selected time', null, 409);
            }
            if ($this->checkConflict($input['booking_date'], $input['start_time'], $input['end_time'], 'student_id', $input['student_id'], $id)) {
                jsonResponse(false, 'This student already has a booking at the selected time', null, 409);
            }

            $query = "UPDATE bookings SET 
                student_id = :student_id, 
                course_id = :course_id, 
                instructor_id = :instructor_id, 
                vehicle_id = :vehicle_id, 
                booking_date = :booking_date, 
                start_time = :start_time, 
                end_time = :end_time, 
                course_fee = :course_fee, 
                paid_amount = :paid_amount, 
                payment_status = :payment_status, 
                status = :status
                WHERE id = :id";
                
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':id' => $id,
                ':student_id' => $input['student_id'],
                ':course_id' => $input['course_id'],
                ':instructor_id' => $input['instructor_id'],
                ':vehicle_id' => $input['vehicle_id'],
                ':booking_date' => $input['booking_date'],
                ':start_time' => $input['start_time'],
                ':end_time' => $input['end_time'],
                ':course_fee' => $input['course_fee'] ?? 0,
                ':paid_amount' => $input['paid_amount'] ?? 0,
                ':payment_status' => $input['payment_status'] ?? 'Pending',
                ':status' => $input['status'] ?? 'Pending'
            ]);
            
            jsonResponse(true, 'Booking updated successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function deleteBooking($id) {
        try {
            $checkStmt = $this->conn->prepare("SELECT id FROM bookings WHERE id = :id");
            $checkStmt->execute([':id' => $id]);
            if ($checkStmt->rowCount() === 0) {
                jsonResponse(false, 'Booking not found', null, 404);
            }

            $query = "DELETE FROM bookings WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            jsonResponse(true, 'Booking deleted successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
