<?php
class ContentController {
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
                if ($action === 'banners') {
                    $this->getBanners();
                } else if ($action === 'about') {
                    $this->getAbout();
                } else if ($action === 'about-features') {
                    $this->getAboutFeatures();
                } else if ($action === 'about-statistics') {
                    $this->getAboutStatistics();
                } else {
                    jsonResponse(false, "Invalid endpoint", null, 404);
                }
                break;
            case 'POST':
                if ($action === 'banners') {
                    $this->createBanner($input);
                } else if ($action === 'about-features') {
                    $this->createAboutFeature($input);
                } else {
                    jsonResponse(false, "Invalid endpoint", null, 404);
                }
                break;
            case 'PUT':
                if ($action === 'about') {
                    $this->updateAbout($input);
                } else if (preg_match('/^banners\/(\d+)$/', $action, $matches)) {
                    $this->updateBanner($matches[1], $input);
                } else if (preg_match('/^about-features\/(\d+)$/', $action, $matches)) {
                    $this->updateAboutFeature($matches[1], $input);
                } else if ($action === 'about-statistics') {
                    $this->updateAboutStatistics($input);
                } else {
                    jsonResponse(false, "Invalid endpoint", null, 404);
                }
                break;
            case 'DELETE':
                if (preg_match('/^banners\/(\d+)$/', $action, $matches)) {
                    $this->deleteBanner($matches[1]);
                } else if (preg_match('/^about-features\/(\d+)$/', $action, $matches)) {
                    $this->deleteAboutFeature($matches[1]);
                } else {
                    jsonResponse(false, "Invalid endpoint", null, 404);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    // --- Banners ---

    private function getBanners() {
        try {
            $stmt = $this->conn->query("SELECT * FROM banners ORDER BY sort_order ASC, id DESC");
            $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "Banners retrieved", $banners);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to retrieve banners: " . $e->getMessage(), null, 500);
        }
    }

    private function createBanner($input) {
        if (empty($input['image_url'])) {
            jsonResponse(false, "Image URL is required", null, 422);
            return;
        }
        try {
            $query = "INSERT INTO banners (title, subtitle, image_url, button_text, button_url, sort_order, status) 
                      VALUES (:title, :subtitle, :image_url, :button_text, :button_url, :sort_order, :status)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':title' => $input['title'] ?? null,
                ':subtitle' => $input['subtitle'] ?? null,
                ':image_url' => $input['image_url'],
                ':button_text' => $input['button_text'] ?? null,
                ':button_url' => $input['button_url'] ?? null,
                ':sort_order' => $input['sort_order'] ?? 0,
                ':status' => $input['status'] ?? 'active'
            ]);
            jsonResponse(true, "Banner created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to create banner: " . $e->getMessage(), null, 500);
        }
    }

    private function updateBanner($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];
            $allowed = ['title', 'subtitle', 'image_url', 'button_text', 'button_url', 'sort_order', 'status'];
            
            foreach ($allowed as $field) {
                if (isset($input[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }
            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }
            $query = "UPDATE banners SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            jsonResponse(true, "Banner updated successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to update banner: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteBanner($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM banners WHERE id = :id");
            $stmt->execute([':id' => $id]);
            jsonResponse(true, "Banner deleted successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to delete banner: " . $e->getMessage(), null, 500);
        }
    }

    // --- About Page Data ---

    private function getAbout() {
        try {
            $stmt = $this->conn->query("SELECT * FROM about_page LIMIT 1");
            $about = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$about) {
                // Initialize if empty
                $this->conn->query("INSERT INTO about_page (hero_title) VALUES ('About Us')");
                $stmt = $this->conn->query("SELECT * FROM about_page LIMIT 1");
                $about = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            jsonResponse(true, "About page retrieved", $about);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to retrieve about page: " . $e->getMessage(), null, 500);
        }
    }

    private function updateAbout($input) {
        try {
            $fields = [];
            $params = [];
            $allowed = ['hero_title', 'hero_description', 'story_title', 'story_content', 'mission_title', 'mission_description', 'vision_title', 'vision_description', 'philosophy', 'hero_image', 'story_image', 'status'];
            
            foreach ($allowed as $field) {
                if (isset($input[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }
            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }
            $query = "UPDATE about_page SET " . implode(', ', $fields);
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            jsonResponse(true, "About page updated successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to update about page: " . $e->getMessage(), null, 500);
        }
    }

    // --- About Features ---

    private function getAboutFeatures() {
        try {
            $stmt = $this->conn->query("SELECT * FROM about_features ORDER BY display_order ASC, id DESC");
            $features = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "Features retrieved", $features);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to retrieve features: " . $e->getMessage(), null, 500);
        }
    }

    private function createAboutFeature($input) {
        if (empty($input['title'])) {
            jsonResponse(false, "Title is required", null, 422);
            return;
        }
        try {
            $query = "INSERT INTO about_features (icon, title, description, display_order, status) 
                      VALUES (:icon, :title, :description, :display_order, :status)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':icon' => $input['icon'] ?? null,
                ':title' => $input['title'],
                ':description' => $input['description'] ?? null,
                ':display_order' => $input['display_order'] ?? 0,
                ':status' => $input['status'] ?? 'active'
            ]);
            jsonResponse(true, "Feature created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to create feature: " . $e->getMessage(), null, 500);
        }
    }

    private function updateAboutFeature($id, $input) {
        try {
            $fields = [];
            $params = [':id' => $id];
            $allowed = ['icon', 'title', 'description', 'display_order', 'status'];
            
            foreach ($allowed as $field) {
                if (isset($input[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field];
                }
            }
            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }
            $query = "UPDATE about_features SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            jsonResponse(true, "Feature updated successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to update feature: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteAboutFeature($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM about_features WHERE id = :id");
            $stmt->execute([':id' => $id]);
            jsonResponse(true, "Feature deleted successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to delete feature: " . $e->getMessage(), null, 500);
        }
    }

    // --- About Statistics ---

    private function getAboutStatistics() {
        try {
            $stmt = $this->conn->query("SELECT * FROM about_statistics ORDER BY id ASC");
            $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, "Statistics retrieved", $stats);
        } catch (PDOException $e) {
            jsonResponse(false, "Failed to retrieve statistics: " . $e->getMessage(), null, 500);
        }
    }

    private function updateAboutStatistics($input) {
        // Expects an array of stats
        if (!isset($input['statistics']) || !is_array($input['statistics'])) {
            jsonResponse(false, "Invalid input format", null, 400);
            return;
        }

        try {
            $this->conn->beginTransaction();
            $stmt = $this->conn->prepare("UPDATE about_statistics SET stat_value = :val, label = :label WHERE stat_key = :key");
            
            foreach ($input['statistics'] as $stat) {
                if (isset($stat['stat_key'], $stat['stat_value'], $stat['label'])) {
                    $stmt->execute([
                        ':val' => $stat['stat_value'],
                        ':label' => $stat['label'],
                        ':key' => $stat['stat_key']
                    ]);
                }
            }
            $this->conn->commit();
            jsonResponse(true, "Statistics updated successfully");
        } catch (PDOException $e) {
            $this->conn->rollBack();
            jsonResponse(false, "Failed to update statistics: " . $e->getMessage(), null, 500);
        }
    }
}
?>
