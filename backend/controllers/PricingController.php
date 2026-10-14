<?php
class PricingController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // Only GET is public (so the public website can fetch packages)
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getPricingPackage($action);
                } else {
                    $this->getAllPricingPackages();
                }
                break;
            case 'POST':
                $this->createPricingPackage($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updatePricingPackage($action, $input);
                } else {
                    jsonResponse(false, "Package ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deletePricingPackage($action);
                } else {
                    jsonResponse(false, "Package ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllPricingPackages() {
        try {
            $query = "SELECT p.*, c.name as course_name 
                      FROM pricing p 
                      LEFT JOIN courses c ON p.course_id = c.id 
                      ORDER BY p.id ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Decode features JSON
            foreach ($packages as &$pkg) {
                if (!empty($pkg['features'])) {
                    $pkg['features'] = json_decode($pkg['features'], true);
                } else {
                    $pkg['features'] = [];
                }
            }

            jsonResponse(true, "Pricing packages retrieved successfully", $packages);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve packages: " . $e->getMessage(), null, 500);
        }
    }

    private function getPricingPackage($id) {
        try {
            $query = "SELECT p.*, c.name as course_name 
                      FROM pricing p 
                      LEFT JOIN courses c ON p.course_id = c.id 
                      WHERE p.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $pkg = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!empty($pkg['features'])) {
                    $pkg['features'] = json_decode($pkg['features'], true);
                } else {
                    $pkg['features'] = [];
                }
                jsonResponse(true, "Pricing package retrieved successfully", $pkg);
            } else {
                jsonResponse(false, "Pricing package not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve package: " . $e->getMessage(), null, 500);
        }
    }

    private function createPricingPackage($input) {
        if (empty($input['package_name']) || empty($input['regular_price'])) {
            jsonResponse(false, "Missing required fields (package_name, regular_price)", null, 422);
            return;
        }

        try {
            $query = "INSERT INTO pricing (course_id, package_name, lessons, regular_price, discount_price, is_popular, features, status) 
                      VALUES (:course_id, :package_name, :lessons, :regular_price, :discount_price, :is_popular, :features, :status)";
            
            $stmt = $this->conn->prepare($query);
            
            $features = isset($input['features']) ? json_encode($input['features']) : json_encode([]);
            
            $stmt->execute([
                ':course_id' => !empty($input['course_id']) ? $input['course_id'] : null,
                ':package_name' => $input['package_name'],
                ':lessons' => $input['lessons'] ?? null,
                ':regular_price' => $input['regular_price'],
                ':discount_price' => $input['discount_price'] ?? null,
                ':is_popular' => isset($input['is_popular']) ? (int)$input['is_popular'] : 0,
                ':features' => $features,
                ':status' => $input['status'] ?? 'active'
            ]);

            jsonResponse(true, "Pricing package created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create package: " . $e->getMessage(), null, 500);
        }
    }

    private function updatePricingPackage($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];
            $allowedFields = ['course_id', 'package_name', 'lessons', 'regular_price', 'discount_price', 'is_popular', 'status'];

            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field] === '' ? null : $input[$field];
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

            $query = "UPDATE pricing SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            jsonResponse(true, "Pricing package updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update package: " . $e->getMessage(), null, 500);
        }
    }

    private function deletePricingPackage($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM pricing WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Pricing package deleted successfully");
            } else {
                jsonResponse(false, "Pricing package not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete package: " . $e->getMessage(), null, 500);
        }
    }
}
?>
