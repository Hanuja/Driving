<?php
class ContactMessageController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // Only POST is public (for users sending messages)
        // GET, PUT, DELETE require admin auth
        if ($method !== 'POST' || isset($_GET['admin'])) {
            $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getMessage($action);
                } else {
                    $this->getAllMessages();
                }
                break;
            case 'POST':
                $this->createMessage($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateMessageStatus($action, $input);
                } else {
                    jsonResponse(false, "Message ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteMessage($action);
                } else {
                    jsonResponse(false, "Message ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllMessages() {
        try {
            $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse(true, "Messages retrieved successfully", $messages);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve messages: " . $e->getMessage(), null, 500);
        }
    }

    private function getMessage($id) {
        try {
            $query = "SELECT * FROM contact_messages WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $message = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Auto-mark as read if unread
                if ($message['status'] === 'unread') {
                    $upd = $this->conn->prepare("UPDATE contact_messages SET status = 'read' WHERE id = :id");
                    $upd->execute([':id' => $id]);
                    $message['status'] = 'read';
                }

                jsonResponse(true, "Message retrieved successfully", $message);
            } else {
                jsonResponse(false, "Message not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve message: " . $e->getMessage(), null, 500);
        }
    }

    private function createMessage($input) {
        if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
            jsonResponse(false, "Name, Email, and Message are required", null, 422);
            return;
        }

        try {
            $query = "INSERT INTO contact_messages (name, email, phone, subject, message, status) 
                      VALUES (:name, :email, :phone, :subject, :message, 'unread')";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->execute([
                ':name' => $input['name'],
                ':email' => $input['email'],
                ':phone' => $input['phone'] ?? null,
                ':subject' => $input['subject'] ?? null,
                ':message' => $input['message']
            ]);

            jsonResponse(true, "Message sent successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to send message: " . $e->getMessage(), null, 500);
        }
    }

    private function updateMessageStatus($id, $input) {
        if (empty($input['status']) || !in_array($input['status'], ['unread', 'read', 'replied'])) {
            jsonResponse(false, "Invalid status", null, 422);
            return;
        }

        try {
            $query = "UPDATE contact_messages SET status = :status WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ':status' => $input['status'],
                ':id' => $id
            ]);

            jsonResponse(true, "Message status updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update status: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteMessage($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM contact_messages WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Message deleted successfully");
            } else {
                jsonResponse(false, "Message not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete message: " . $e->getMessage(), null, 500);
        }
    }
}
?>
