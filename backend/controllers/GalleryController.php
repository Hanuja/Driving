<?php
class GalleryController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // Authenticate all requests except GET
        // Authenticate all requests except GET
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        } else {
            // Uncomment below if you want GET to be protected
            // $this->auth->requireAuth();
        }

        // Special case for PUT/DELETE categories/{id}
        // Action would be like 'categories/5' but $uri[1] is action, $uri[2] is id
        // Let's rely on standard GET parameters or index.php routing
        // Wait, index.php gives us:
        // $resource = $uri[0] (gallery)
        // $action = $uri[1] (categories, or {id})
        // $id = $uri[2] ?? null
        
        // So I'll restructure this slightly to parse the ID.
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

        // Handle Main Gallery Items
        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getGalleryItem($action);
                } else {
                    $this->getAllGalleryItems();
                }
                break;
            case 'POST':
                $this->createGalleryItem($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateGalleryItem($action, $input);
                } else {
                    jsonResponse(false, "Gallery Item ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteGalleryItem($action);
                } else {
                    jsonResponse(false, "Gallery Item ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    // ==========================================
    // GALLERY CATEGORIES CRUD
    // ==========================================

    private function getCategories() {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM gallery_categories ORDER BY sort_order ASC, name ASC");
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
            $check = $this->conn->prepare("SELECT id FROM gallery_categories WHERE name = :name");
            $check->execute([':name' => $input['name']]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A category with this name already exists", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("INSERT INTO gallery_categories (name, sort_order) VALUES (:name, :sort_order)");
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
            $check = $this->conn->prepare("SELECT id FROM gallery_categories WHERE name = :name AND id != :id");
            $check->execute([':name' => $input['name'], ':id' => $id]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A category with this name already exists", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("UPDATE gallery_categories SET name = :name, sort_order = :sort_order WHERE id = :id");
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
            $stmt = $this->conn->prepare("DELETE FROM gallery_categories WHERE id = :id");
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
    // GALLERY ITEMS CRUD
    // ==========================================

    private function getAllGalleryItems() {
        try {
            $query = "SELECT g.*, c.name as category_name 
                      FROM gallery g 
                      LEFT JOIN gallery_categories c ON g.category_id = c.id 
                      ORDER BY g.sort_order ASC, g.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "Gallery items retrieved successfully", $items);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve gallery items: " . $e->getMessage(), null, 500);
        }
    }

    private function getGalleryItem($id) {
        try {
            $query = "SELECT g.*, c.name as category_name 
                      FROM gallery g 
                      LEFT JOIN gallery_categories c ON g.category_id = c.id 
                      WHERE g.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Gallery item retrieved successfully", $stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                jsonResponse(false, "Gallery item not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve gallery item: " . $e->getMessage(), null, 500);
        }
    }

    private function createGalleryItem($input) {
        if (empty($input['image_url'])) {
            jsonResponse(false, "Image URL is required", null, 422);
            return;
        }
        try {
            $query = "INSERT INTO gallery (title, category_id, description, image_url, sort_order, status) 
                      VALUES (:title, :category_id, :description, :image_url, :sort_order, :status)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':title' => $input['title'] ?? null,
                ':category_id' => !empty($input['category_id']) ? $input['category_id'] : null,
                ':description' => $input['description'] ?? null,
                ':image_url' => $input['image_url'],
                ':sort_order' => $input['sort_order'] ?? 0,
                ':status' => $input['status'] ?? 'active'
            ]);
            jsonResponse(true, "Gallery item created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create gallery item: " . $e->getMessage(), null, 500);
        }
    }

    private function updateGalleryItem($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];
            $allowedFields = ['title', 'category_id', 'description', 'image_url', 'sort_order', 'status'];

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

            $query = "UPDATE gallery SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            jsonResponse(true, "Gallery item updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update gallery item: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteGalleryItem($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM gallery WHERE id = :id");
            $stmt->execute([':id' => $id]);
            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Gallery item deleted successfully");
            } else {
                jsonResponse(false, "Gallery item not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete gallery item: " . $e->getMessage(), null, 500);
        }
    }
}
?>
