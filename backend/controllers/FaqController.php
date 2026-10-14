<?php
class FaqController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // Authenticate all requests except GET
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        } else {
            // Uncomment below if you want GET to be protected
            $this->auth->requireAuth();
        }

        global $uri;
        $subAction = $uri[2] ?? null;

        if ($action === 'categories') {
            if ($method === 'GET') {
                $this->getCategories();
            } else if ($method === 'POST') {
                $this->createCategory($input);
            } else if ($method === 'PUT' && $subAction) {
                $this->updateCategory($subAction, $input);
            } else if ($method === 'DELETE' && $subAction) {
                $this->deleteCategory($subAction);
            } else {
                jsonResponse(false, "Method not allowed for categories", null, 405);
            }
            return;
        }

        // Handle Main FAQ Items
        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getFaq($action);
                } else {
                    $this->getAllFaqs();
                }
                break;
            case 'POST':
                $this->createFaq($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateFaq($action, $input);
                } else {
                    jsonResponse(false, "FAQ ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteFaq($action);
                } else {
                    jsonResponse(false, "FAQ ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    // ==========================================
    // FAQ CATEGORIES CRUD
    // ==========================================

    private function getCategories() {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM faq_categories ORDER BY sort_order ASC, name ASC");
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "Categories retrieved successfully", $categories);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve categories: " . $e->getMessage(), null, 500);
        }
    }

    private function createCategory($input) {
        if (empty($input['name'])) {
            jsonResponse(false, "Category name is required", null, 422);
            return;
        }
        try {
            // Check duplicate
            $check = $this->conn->prepare("SELECT id FROM faq_categories WHERE name = :name");
            $check->execute([':name' => $input['name']]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A category with this name already exists", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("INSERT INTO faq_categories (name, sort_order) VALUES (:name, :sort_order)");
            $stmt->execute([
                ':name' => $input['name'],
                ':sort_order' => $input['sort_order'] ?? 0
            ]);
            jsonResponse(true, "Category created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create category: " . $e->getMessage(), null, 500);
        }
    }

    private function updateCategory($id, $input) {
        if (empty($input['name'])) {
            jsonResponse(false, "Category name is required", null, 422);
            return;
        }
        try {
            $check = $this->conn->prepare("SELECT id FROM faq_categories WHERE name = :name AND id != :id");
            $check->execute([':name' => $input['name'], ':id' => $id]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A category with this name already exists", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("UPDATE faq_categories SET name = :name, sort_order = :sort_order WHERE id = :id");
            $stmt->execute([
                ':name' => $input['name'],
                ':sort_order' => $input['sort_order'] ?? 0,
                ':id' => $id
            ]);
            jsonResponse(true, "Category updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update category: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteCategory($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM faq_categories WHERE id = :id");
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Category deleted successfully");
            } else {
                jsonResponse(false, "Category not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete category: " . $e->getMessage(), null, 500);
        }
    }

    // ==========================================
    // FAQs CRUD
    // ==========================================

    private function getAllFaqs() {
        try {
            $query = "SELECT f.*, c.name as category_name 
                      FROM faqs f 
                      LEFT JOIN faq_categories c ON f.category_id = c.id 
                      ORDER BY f.sort_order ASC, f.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "FAQs retrieved successfully", $items);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve FAQs: " . $e->getMessage(), null, 500);
        }
    }

    private function getFaq($id) {
        try {
            $query = "SELECT f.*, c.name as category_name 
                      FROM faqs f 
                      LEFT JOIN faq_categories c ON f.category_id = c.id 
                      WHERE f.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "FAQ retrieved successfully", $stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                jsonResponse(false, "FAQ not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve FAQ: " . $e->getMessage(), null, 500);
        }
    }

    private function createFaq($input) {
        if (empty($input['question']) || empty($input['answer'])) {
            jsonResponse(false, "Question and Answer are required", null, 422);
            return;
        }
        try {
            $query = "INSERT INTO faqs (category_id, question, answer, sort_order, status) 
                      VALUES (:category_id, :question, :answer, :sort_order, :status)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':category_id' => !empty($input['category_id']) ? $input['category_id'] : null,
                ':question' => $input['question'],
                ':answer' => $input['answer'],
                ':sort_order' => $input['sort_order'] ?? 0,
                ':status' => $input['status'] ?? 'active'
            ]);
            jsonResponse(true, "FAQ created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create FAQ: " . $e->getMessage(), null, 500);
        }
    }

    private function updateFaq($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];
            $allowedFields = ['category_id', 'question', 'answer', 'sort_order', 'status'];

            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field] === '' ? null : $input[$field];
                }
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE faqs SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            jsonResponse(true, "FAQ updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update FAQ: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteFaq($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM faqs WHERE id = :id");
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "FAQ deleted successfully");
            } else {
                jsonResponse(false, "FAQ not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete FAQ: " . $e->getMessage(), null, 500);
        }
    }
}
?>
