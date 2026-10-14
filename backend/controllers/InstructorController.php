<?php
class InstructorController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getInstructor($action);
                } else {
                    $this->getAllInstructors();
                }
                break;
            case 'POST':
                $this->createInstructor($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateInstructor($action, $input);
                } else {
                    jsonResponse(false, "Instructor ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteInstructor($action);
                } else {
                    jsonResponse(false, "Instructor ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllInstructors() {
        try {
            $query = "SELECT i.*, 
                        b.name as branch_name,
                        v.vehicle_number as vehicle_number,
                        (SELECT COUNT(*) FROM students s WHERE s.instructor_id = i.id) as student_count
                      FROM instructors i
                      LEFT JOIN branches b ON i.branch_id = b.id
                      LEFT JOIN vehicles v ON i.vehicle_id = v.id
                      ORDER BY i.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $instructors = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($instructors as &$inst) {
                $inst['assigned_courses'] = !empty($inst['assigned_courses']) ? json_decode($inst['assigned_courses'], true) : [];
                $inst['working_schedule'] = !empty($inst['working_schedule']) ? json_decode($inst['working_schedule'], true) : null;
            }

            jsonResponse(true, "Instructors retrieved successfully", $instructors);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve instructors: " . $e->getMessage(), null, 500);
        }
    }

    private function getInstructor($id) {
        try {
            $query = "SELECT i.*, 
                        b.name as branch_name, b.address as branch_address, b.phone as branch_phone, b.manager as branch_manager,
                        v.vehicle_number as vehicle_number, v.model as vehicle_model, v.transmission as vehicle_transmission, v.status as vehicle_status,
                        (SELECT COUNT(*) FROM students s WHERE s.instructor_id = i.id) as total_students,
                        (SELECT COUNT(*) FROM students s WHERE s.instructor_id = i.id AND s.status = 'Active') as active_students,
                        (SELECT COUNT(*) FROM students s WHERE s.instructor_id = i.id AND s.status = 'Completed') as completed_students,
                        (SELECT COUNT(*) FROM bookings bk WHERE bk.instructor_id = i.id AND DATE(bk.booking_date) = CURDATE()) as todays_lessons
                      FROM instructors i
                      LEFT JOIN branches b ON i.branch_id = b.id
                      LEFT JOIN vehicles v ON i.vehicle_id = v.id
                      WHERE i.id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                $instructor = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $instructor['assigned_courses'] = !empty($instructor['assigned_courses']) ? json_decode($instructor['assigned_courses'], true) : [];
                $instructor['working_schedule'] = !empty($instructor['working_schedule']) ? json_decode($instructor['working_schedule'], true) : null;

                // Fetch full course details for assigned courses
                $courseDetails = [];
                if (!empty($instructor['assigned_courses'])) {
                    $inQuery = implode(',', array_fill(0, count($instructor['assigned_courses']), '?'));
                    $cStmt = $this->conn->prepare("SELECT id, name, type, (SELECT COUNT(*) FROM students WHERE course_id = courses.id) as student_count FROM courses WHERE id IN ($inQuery)");
                    $cStmt->execute($instructor['assigned_courses']);
                    $courseDetails = $cStmt->fetchAll(PDO::FETCH_ASSOC);
                }
                $instructor['courses_list'] = $courseDetails;

                // Fetch Booking History
                $bStmt = $this->conn->prepare("SELECT bk.booking_id, s.name as student_name, c.name as course_name, v.vehicle_number as vehicle_number, bk.booking_date, bk.start_time, bk.end_time, bk.status
                                               FROM bookings bk
                                               LEFT JOIN students s ON bk.student_id = s.id
                                               LEFT JOIN courses c ON bk.course_id = c.id
                                               LEFT JOIN vehicles v ON bk.vehicle_id = v.id
                                               WHERE bk.instructor_id = :id ORDER BY bk.booking_date DESC, bk.start_time DESC LIMIT 50");
                $bStmt->execute([':id' => $id]);
                $instructor['booking_history'] = $bStmt->fetchAll(PDO::FETCH_ASSOC);

                jsonResponse(true, "Instructor retrieved successfully", $instructor);
            } else {
                jsonResponse(false, "Instructor not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve instructor: " . $e->getMessage(), null, 500);
        }
    }

    private function createInstructor($input) {
        if (empty($input['name']) || empty($input['email']) || empty($input['phone']) || empty($input['instructor_code']) || empty($input['license_number'])) {
            jsonResponse(false, "Missing required fields", null, 422);
            return;
        }

        try {
            // Check unique constraints
            $check = $this->conn->prepare("SELECT id FROM instructors WHERE instructor_code = :code OR email = :email OR license_number = :license");
            $check->execute([
                ':code' => $input['instructor_code'],
                ':email' => $input['email'],
                ':license' => $input['license_number']
            ]);
            
            if ($check->rowCount() > 0) {
                jsonResponse(false, "Instructor ID, Email, or License Number already exists.", null, 409);
                return;
            }

            // Check if vehicle is already assigned
            if (!empty($input['vehicle_id'])) {
                $vehCheck = $this->conn->prepare("SELECT id FROM instructors WHERE vehicle_id = :vid AND status = 'Active'");
                $vehCheck->execute([':vid' => $input['vehicle_id']]);
                if ($vehCheck->rowCount() > 0) {
                    jsonResponse(false, "This vehicle is currently assigned to another active instructor.", null, 409);
                    return;
                }
            }

            $query = "INSERT INTO instructors (instructor_code, nic, name, email, phone, alternative_phone, date_of_birth, gender, address, city, license_number, license_category, license_expiry, experience, qualification, specialties, branch_id, vehicle_id, assigned_courses, working_schedule, image, status, availability) 
                      VALUES (:code, :nic, :name, :email, :phone, :alt_phone, :dob, :gender, :address, :city, :license, :license_cat, :license_exp, :experience, :qualification, :specialties, :branch_id, :vehicle_id, :courses, :schedule, :image, :status, :availability)";
            
            $stmt = $this->conn->prepare($query);
            
            $assigned_courses = isset($input['assigned_courses']) ? json_encode($input['assigned_courses']) : json_encode([]);
            $schedule = isset($input['working_schedule']) ? json_encode($input['working_schedule']) : null;
            
            $stmt->execute([
                ':code' => $input['instructor_code'],
                ':nic' => $input['nic'] ?? null,
                ':name' => $input['name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'],
                ':alt_phone' => $input['alternative_phone'] ?? null,
                ':dob' => $input['date_of_birth'] ?? null,
                ':gender' => $input['gender'] ?? null,
                ':address' => $input['address'] ?? null,
                ':city' => $input['city'] ?? null,
                ':license' => $input['license_number'],
                ':license_cat' => $input['license_category'] ?? null,
                ':license_exp' => $input['license_expiry'] ?? null,
                ':experience' => $input['experience_years'] ?? null,
                ':qualification' => $input['qualification'] ?? null,
                ':specialties' => $input['specialization'] ?? null,
                ':branch_id' => $input['branch_id'] ?? null,
                ':vehicle_id' => $input['vehicle_id'] ?? null,
                ':courses' => $assigned_courses,
                ':schedule' => $schedule,
                ':image' => $input['image'] ?? null,
                ':status' => $input['status'] ?? 'Active',
                ':availability' => $input['availability'] ?? 'Available'
            ]);

            jsonResponse(true, "Instructor created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create instructor: " . $e->getMessage(), null, 500);
        }
    }

    private function updateInstructor($id, $input) {
        try {
            // Check unique constraints
            $check = $this->conn->prepare("SELECT id FROM instructors WHERE (instructor_code = :code OR email = :email OR license_number = :license) AND id != :id");
            $check->execute([
                ':code' => $input['instructor_code'] ?? '',
                ':email' => $input['email'] ?? '',
                ':license' => $input['license_number'] ?? '',
                ':id' => $id
            ]);
            
            if ($check->rowCount() > 0) {
                jsonResponse(false, "Instructor ID, Email, or License Number already in use by another instructor.", null, 409);
                return;
            }

            if (!empty($input['vehicle_id'])) {
                $vehCheck = $this->conn->prepare("SELECT id FROM instructors WHERE vehicle_id = :vid AND status = 'Active' AND id != :id");
                $vehCheck->execute([':vid' => $input['vehicle_id'], ':id' => $id]);
                if ($vehCheck->rowCount() > 0) {
                    jsonResponse(false, "This vehicle is currently assigned to another active instructor.", null, 409);
                    return;
                }
            }

            $fields = [];
            $params = [':id' => $id];

            $allowed = [
                'instructor_code', 'nic', 'name', 'email', 'phone', 'alternative_phone', 'date_of_birth', 
                'gender', 'address', 'city', 'license_number', 'license_category', 'license_expiry', 
                'qualification', 'branch_id', 'vehicle_id', 'image', 'status', 'availability'
            ];

            foreach ($allowed as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field] === '' ? null : $input[$field];
                }
            }
            
            // Handle mappings
            if (array_key_exists('experience_years', $input)) {
                $fields[] = "experience = :exp";
                $params[":exp"] = $input['experience_years'];
            }
            if (array_key_exists('specialization', $input)) {
                $fields[] = "specialties = :spec";
                $params[":spec"] = $input['specialization'];
            }
            if (array_key_exists('assigned_courses', $input)) {
                $fields[] = "assigned_courses = :courses";
                $params[":courses"] = json_encode($input['assigned_courses']);
            }
            if (array_key_exists('working_schedule', $input)) {
                $fields[] = "working_schedule = :sched";
                $params[":sched"] = json_encode($input['working_schedule']);
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE instructors SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            jsonResponse(true, "Instructor updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update instructor: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteInstructor($id) {
        try {
            // Check active bookings
            $checkBook = $this->conn->prepare("SELECT COUNT(*) FROM bookings WHERE instructor_id = :id AND status IN ('Pending', 'Confirmed')");
            $checkBook->execute([':id' => $id]);
            if ($checkBook->fetchColumn() > 0) {
                jsonResponse(false, "This instructor cannot be deleted because they have active bookings. You can deactivate the instructor instead.", null, 409);
                return;
            }

            // Check assigned active students
            $checkStu = $this->conn->prepare("SELECT COUNT(*) FROM students WHERE instructor_id = :id AND status IN ('Active', 'Pending')");
            $checkStu->execute([':id' => $id]);
            if ($checkStu->fetchColumn() > 0) {
                jsonResponse(false, "This instructor cannot be deleted because they have active students assigned. You can deactivate the instructor instead.", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("DELETE FROM instructors WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Instructor deleted successfully");
            } else {
                jsonResponse(false, "Instructor not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete instructor: " . $e->getMessage(), null, 500);
        }
    }
}
?>
