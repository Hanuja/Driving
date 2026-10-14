<?php
class TestimonialController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // GET can be public (if we want to show approved testimonials on frontend)
        // But for admin management, we require auth for all
        if ($method !== 'GET' || isset($_GET['admin'])) {
            $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getTestimonial($action);
                } else {
                    $this->getAllTestimonials(isset($_GET['admin']));
                }
                break;
            case 'POST':
                $this->createTestimonial($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateTestimonial($action, $input);
                } else {
                    jsonResponse(false, "Testimonial ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteTestimonial($action);
                } else {
                    jsonResponse(false, "Testimonial ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllTestimonials($isAdmin) {
        try {
            if ($isAdmin) {
                $query = "SELECT * FROM testimonials ORDER BY id DESC";
            } else {
                $query = "SELECT * FROM testimonials WHERE status = 'approved' ORDER BY date DESC, id DESC";
            }
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse(true, "Testimonials retrieved successfully", $testimonials);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve testimonials: " . $e->getMessage(), null, 500);
        }
    }

    private function getTestimonial($id) {
        try {
            $query = "SELECT * FROM testimonials WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $testimonial = $stmt->fetch(PDO::FETCH_ASSOC);
                jsonResponse(true, "Testimonial retrieved successfully", $testimonial);
            } else {
                jsonResponse(false, "Testimonial not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve testimonial: " . $e->getMessage(), null, 500);
        }
    }

    private function createTestimonial($input) {
        if (empty($input['student_name']) || empty($input['testimonial'])) {
            jsonResponse(false, "Student Name and Testimonial are required", null, 422);
            return;
        }

        try {
            $query = "INSERT INTO testimonials (student_name, course_name, rating, testimonial, image_url, status, date) 
                      VALUES (:student_name, :course_name, :rating, :testimonial, :image_url, :status, :date)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->execute([
                ':student_name' => $input['student_name'],
                ':course_name' => $input['course_name'] ?? null,
                ':rating' => isset($input['rating']) ? (int)$input['rating'] : 5,
                ':testimonial' => $input['testimonial'],
                ':image_url' => $input['image_url'] ?? null,
                ':status' => $input['status'] ?? 'pending',
                ':date' => $input['date'] ?? date('Y-m-d')
            ]);

            jsonResponse(true, "Testimonial created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create testimonial: " . $e->getMessage(), null, 500);
        }
    }

    private function updateTestimonial($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];

            $allowedFields = ['student_name', 'course_name', 'rating', 'testimonial', 'image_url', 'status', 'date'];
            
            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE testimonials SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            jsonResponse(true, "Testimonial updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update testimonial: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteTestimonial($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM testimonials WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Testimonial deleted successfully");
            } else {
                jsonResponse(false, "Testimonial not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete testimonial: " . $e->getMessage(), null, 500);
        }
    }
}
?>
