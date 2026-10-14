<?php
require_once __DIR__ . '/AuthController.php';

class StudentController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest($method, $id, $input) {
        AuthController::requireAuth(); // All student endpoints are protected

        if ($method === 'GET') {
            if ($id) {
                $this->getStudent($id);
            } else {
                $this->getStudents();
            }
        } elseif ($method === 'POST') {
            $this->createStudent($input);
        } elseif ($method === 'PUT') {
            if ($id) {
                $this->updateStudent($id, $input);
            } else {
                jsonResponse(false, 'Student ID is required', null, 400);
            }
        } elseif ($method === 'DELETE') {
            if ($id) {
                $this->deleteStudent($id);
            } else {
                jsonResponse(false, 'Student ID is required', null, 400);
            }
        } else {
            jsonResponse(false, 'Method not allowed', null, 405);
        }
    }

    private function getStudents() {
        try {
            $query = "SELECT s.*, 
                             c.name as course_name, 
                             i.name as instructor_name, 
                             v.vehicle_number 
                      FROM students s
                      LEFT JOIN courses c ON s.course_id = c.id
                      LEFT JOIN instructors i ON s.instructor_id = i.id
                      LEFT JOIN vehicles v ON s.vehicle_id = v.id
                      ORDER BY s.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, 'Students retrieved successfully', $students);
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function getStudent($id) {
        try {
            $query = "SELECT s.*, 
                             c.name as course_name, 
                             c.duration as course_duration,
                             i.name as instructor_name, 
                             i.phone as instructor_phone,
                             v.vehicle_number 
                      FROM students s
                      LEFT JOIN courses c ON s.course_id = c.id
                      LEFT JOIN instructors i ON s.instructor_id = i.id
                      LEFT JOIN vehicles v ON s.vehicle_id = v.id
                      WHERE s.id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $student = $stmt->fetch(PDO::FETCH_ASSOC);
                jsonResponse(true, 'Student retrieved successfully', $student);
            } else {
                jsonResponse(false, 'Student not found', null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function generateStudentId() {
        // Generate a random student ID like STU-2026-XYZ
        return 'STU-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));
    }

    private function createStudent($input) {
        // Validation
        if (empty($input['name']) || empty($input['email']) || empty($input['phone']) || empty($input['course_id'])) {
            jsonResponse(false, 'Name, email, phone, and course are required fields', null, 422);
        }

        if (isset($input['course_fee']) && $input['course_fee'] < 0) {
            jsonResponse(false, 'Course fee cannot be negative', null, 422);
        }

        try {
            // Check duplicate email
            $checkStmt = $this->conn->prepare("SELECT id FROM students WHERE email = :email LIMIT 1");
            $checkStmt->execute([':email' => $input['email']]);
            if ($checkStmt->rowCount() > 0) {
                jsonResponse(false, 'A student with this email already exists', null, 409);
            }

            $query = "INSERT INTO students 
                (student_id, name, email, phone, date_of_birth, gender, address, course_id, instructor_id, vehicle_id, registration_date, course_fee, paid_amount, payment_status, status) 
                VALUES 
                (:student_id, :name, :email, :phone, :date_of_birth, :gender, :address, :course_id, :instructor_id, :vehicle_id, :registration_date, :course_fee, :paid_amount, :payment_status, :status)";
            
            $stmt = $this->conn->prepare($query);
            
            $student_id = $this->generateStudentId();

            $stmt->execute([
                ':student_id' => $student_id,
                ':name' => $input['name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'],
                ':date_of_birth' => $input['date_of_birth'] ?? null,
                ':gender' => $input['gender'] ?? null,
                ':address' => $input['address'] ?? null,
                ':course_id' => $input['course_id'],
                ':instructor_id' => $input['instructor_id'] ?? null,
                ':vehicle_id' => $input['vehicle_id'] ?? null,
                ':registration_date' => $input['registration_date'] ?? date('Y-m-d'),
                ':course_fee' => $input['course_fee'] ?? 0,
                ':paid_amount' => $input['paid_amount'] ?? 0,
                ':payment_status' => $input['payment_status'] ?? 'Pending',
                ':status' => $input['status'] ?? 'Active'
            ]);
            
            $id = $this->conn->lastInsertId();
            
            // If student_id was generated as STU-001 based on ID, update it now
            $updateId = "STU" . str_pad($id, 3, "0", STR_PAD_LEFT);
            $this->conn->prepare("UPDATE students SET student_id = :sid WHERE id = :id")->execute([':sid' => $updateId, ':id' => $id]);

            jsonResponse(true, 'Student added successfully', ['id' => $id, 'student_id' => $updateId], 201);
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function updateStudent($id, $input) {
        // Validation
        if (empty($input['name']) || empty($input['email']) || empty($input['phone']) || empty($input['course_id'])) {
            jsonResponse(false, 'Name, email, phone, and course are required fields', null, 422);
        }

        if (isset($input['course_fee']) && $input['course_fee'] < 0) {
            jsonResponse(false, 'Course fee cannot be negative', null, 422);
        }

        try {
            // Check duplicate email (excluding this student)
            $checkStmt = $this->conn->prepare("SELECT id FROM students WHERE email = :email AND id != :id LIMIT 1");
            $checkStmt->execute([':email' => $input['email'], ':id' => $id]);
            if ($checkStmt->rowCount() > 0) {
                jsonResponse(false, 'A student with this email already exists', null, 409);
            }

            $query = "UPDATE students SET 
                name = :name, 
                email = :email, 
                phone = :phone, 
                date_of_birth = :date_of_birth, 
                gender = :gender, 
                address = :address, 
                course_id = :course_id, 
                instructor_id = :instructor_id, 
                vehicle_id = :vehicle_id, 
                course_fee = :course_fee, 
                paid_amount = :paid_amount, 
                payment_status = :payment_status, 
                status = :status
                WHERE id = :id";
                
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':id' => $id,
                ':name' => $input['name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'],
                ':date_of_birth' => $input['date_of_birth'] ?? null,
                ':gender' => $input['gender'] ?? null,
                ':address' => $input['address'] ?? null,
                ':course_id' => $input['course_id'],
                ':instructor_id' => $input['instructor_id'] ?? null,
                ':vehicle_id' => $input['vehicle_id'] ?? null,
                ':course_fee' => $input['course_fee'] ?? 0,
                ':paid_amount' => $input['paid_amount'] ?? 0,
                ':payment_status' => $input['payment_status'] ?? 'Pending',
                ':status' => $input['status'] ?? 'Active'
            ]);
            
            jsonResponse(true, 'Student updated successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function deleteStudent($id) {
        try {
            // First check if student exists
            $checkStmt = $this->conn->prepare("SELECT id FROM students WHERE id = :id");
            $checkStmt->execute([':id' => $id]);
            if ($checkStmt->rowCount() === 0) {
                jsonResponse(false, 'Student not found', null, 404);
            }

            $query = "DELETE FROM students WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            jsonResponse(true, 'Student deleted successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
