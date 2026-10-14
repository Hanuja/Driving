<?php
require_once __DIR__ . '/AuthController.php';

class SettingsController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest($method, $action, $input) {
        AuthController::requireAuth();

        if ($method === 'GET') {
            $this->getSettings();
        } else if ($method === 'POST' || $method === 'PUT') {
            $this->updateSettings($input);
        } else {
            jsonResponse(false, 'Method not allowed', null, 405);
        }
    }

    private function getSettings() {
        try {
            $query = "SELECT * FROM settings";
            $stmt = $this->conn->query($query);
            $settingsList = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Format settings into a key-value object grouped by setting_group or just flat
            $settings = [];
            foreach ($settingsList as $s) {
                $settings[$s['setting_key']] = $s['setting_value'];
            }

            jsonResponse(true, 'Settings retrieved', $settings);
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function updateSettings($input) {
        try {
            if (empty($input)) {
                jsonResponse(false, 'No settings provided', null, 400);
            }

            $this->conn->beginTransaction();

            $stmt = $this->conn->prepare("
                INSERT INTO settings (setting_key, setting_value) 
                VALUES (:key, :value)
                ON DUPLICATE KEY UPDATE setting_value = :value
            ");

            foreach ($input as $key => $value) {
                $stmt->execute([
                    ':key' => $key,
                    ':value' => $value
                ]);
            }

            $this->conn->commit();
            jsonResponse(true, 'Settings updated successfully');
        } catch (PDOException $e) {
            $this->conn->rollBack();
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
