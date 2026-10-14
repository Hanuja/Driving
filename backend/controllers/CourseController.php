<?php
class CourseController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // All endpoints except GET require authentication
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        } else {
            // Optional: If you want GET to be protected, uncomment below:
            // $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getCourse($action);
                } else {
                    $this->getAllCourses();
                }
                break;
            case 'POST':
                $this->createCourse($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateCourse($action, $input);
                } else {
                    jsonResponse(false, "Course ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteCourse($action);
                } else {
                    jsonResponse(false, "Course ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllCourses() {
        try {
            $query = "SELECT c.*, 
                      (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id) as student_count 
                      FROM courses c ORDER BY c.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Parse features JSON for each course
            foreach ($courses as &$course) {
                if (!empty($course['features'])) {
                    $course['features'] = json_decode($course['features'], true);
                } else {
                    $course['features'] = [];
                }
            }

            jsonResponse(true, "Courses retrieved successfully", $courses);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve courses: " . $e->getMessage(), null, 500);
        }
    }

    private function getCourse($id) {
        try {
            $query = "SELECT c.*,
                        (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id) as total_students,
                        (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id AND s.status = 'Active') as active_students,
                        (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id AND s.status = 'Completed') as completed_students,
                        (SELECT COUNT(*) FROM students s WHERE s.course_id = c.id AND s.status = 'Pending') as pending_students
                      FROM courses c WHERE c.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $course = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!empty($course['features'])) {
                    $course['features'] = json_decode($course['features'], true);
                } else {
                    $course['features'] = [];
                }
                jsonResponse(true, "Course retrieved successfully", $course);
            } else {
                jsonResponse(false, "Course not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve course: " . $e->getMessage(), null, 500);
        }
    }

    private function createCourse($input) {
        // Check required fields
        if (empty($input['name']) || empty($input['code']) || empty($input['type']) || empty($input['description'])) {
            jsonResponse(false, "Missing required fields", null, 422);
            return;
        }

        // Check for duplicate code
        try {
            $check = $this->conn->prepare("SELECT id FROM courses WHERE code = :code");
            $check->execute([':code' => $input['code']]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A course with this course code already exists.", null, 409);
                return;
            }

            $query = "INSERT INTO courses (name, code, type, description, transmission, duration, lessons, lesson_duration, price, registration_fee, status, features, image) 
                      VALUES (:name, :code, :type, :description, :transmission, :duration, :lessons, :lesson_duration, :price, :registration_fee, :status, :features, :image)";
            
            $stmt = $this->conn->prepare($query);
            
            $features = isset($input['features']) ? json_encode($input['features']) : json_encode([]);
            
            $stmt->execute([
                ':name' => $input['name'],
                ':code' => $input['code'],
                ':type' => $input['type'],
                ':description' => $input['description'],
                ':transmission' => $input['transmission'] ?? null,
                ':duration' => $input['duration'] ?? null,
                ':lessons' => $input['lessons'] ?? null,
                ':lesson_duration' => $input['lesson_duration'] ?? null,
                ':price' => $input['price'] ?? 0,
                ':registration_fee' => $input['registration_fee'] ?? 0,
                ':status' => $input['status'] ?? 'Active',
                ':features' => $features,
                ':image' => $input['image'] ?? null
            ]);

            jsonResponse(true, "Course created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create course: " . $e->getMessage(), null, 500);
        }
    }

    private function updateCourse($id, $input) {
        // Check for duplicate code
        try {
            if (!empty($input['code'])) {
                $check = $this->conn->prepare("SELECT id FROM courses WHERE code = :code AND id != :id");
                $check->execute([':code' => $input['code'], ':id' => $id]);
                if ($check->rowCount() > 0) {
                    jsonResponse(false, "A course with this course code already exists.", null, 409);
                    return;
                }
            }

            // Build update query dynamically
            $fields = [];
            $params = [':id' => $id];

            $allowedFields = ['name', 'code', 'type', 'description', 'transmission', 'duration', 'lessons', 'lesson_duration', 'price', 'registration_fee', 'status', 'image'];
            foreach ($allowedFields as $field) {
                if (isset($input[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }

            if (isset($input['features'])) {
                $fields[] = "features = :features";
                $params[':features'] = json_encode($input['features']);
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE courses SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            jsonResponse(true, "Course updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update course: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteCourse($id) {
        try {
            // Check active bookings
            $checkBookings = $this->conn->prepare("SELECT COUNT(*) FROM bookings WHERE course_id = :id AND status NOT IN ('Completed', 'Cancelled', 'Rejected')");
            $checkBookings->execute([':id' => $id]);
            $activeBookings = $checkBookings->fetchColumn();

            if ($activeBookings > 0) {
                jsonResponse(false, "This course cannot be deleted because it has active bookings. You can deactivate the course instead.", null, 409);
                return;
            }

            // Check if there are any students
            $checkStudents = $this->conn->prepare("SELECT COUNT(*) FROM students WHERE course_id = :id");
            $checkStudents->execute([':id' => $id]);
            $studentsCount = $checkStudents->fetchColumn();

            if ($studentsCount > 0) {
                jsonResponse(false, "This course cannot be deleted because it has enrolled students. You can deactivate the course instead.", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("DELETE FROM courses WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Course deleted successfully");
            } else {
                jsonResponse(false, "Course not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete course: " . $e->getMessage(), null, 500);
        }
    }
}
?>
