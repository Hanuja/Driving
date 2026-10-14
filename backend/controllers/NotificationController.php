<?php
require_once __DIR__ . '/AuthController.php';

class NotificationController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest($method, $action, $input) {
        AuthController::requireAuth();

        if ($method === 'GET') {
            $this->getNotifications();
        } else if ($method === 'PUT') {
            if ($action === 'read-all') {
                $this->markAllAsRead();
            } else if ($action) {
                $this->markAsRead($action);
            } else {
                jsonResponse(false, 'Invalid endpoint', null, 404);
            }
        } else {
            jsonResponse(false, 'Method not allowed', null, 405);
        }
    }

    private function getNotifications() {
        try {
            $query = "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50";
            $stmt = $this->conn->query($query);
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get unread count
            $countStmt = $this->conn->query("SELECT COUNT(*) FROM notifications WHERE is_read = FALSE");
            $unreadCount = $countStmt->fetchColumn();

            jsonResponse(true, 'Notifications retrieved', [
                'notifications' => $notifications,
                'unread_count' => (int)$unreadCount
            ]);
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function markAsRead($id) {
        try {
            $stmt = $this->conn->prepare("UPDATE notifications SET is_read = TRUE WHERE id = :id");
            $stmt->execute([':id' => $id]);
            jsonResponse(true, 'Notification marked as read');
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function markAllAsRead() {
        try {
            $this->conn->query("UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE");
            jsonResponse(true, 'All notifications marked as read');
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
