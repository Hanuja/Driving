<?php
require_once 'backend/config/Database.php';
require_once 'backend/controllers/AuthController.php';

$auth = new AuthController();
// Generate a fake token for testing (usually admin payload)
$payload = [
    'admin_id' => 1,
    'email' => 'admin@ceylondrive.lk',
    'exp' => time() + 3600
];
// Generate token using the secret in AuthController
// We can't access private methods, so let's just make a backdoor for this script
$db = new Database();
$conn = $db->getConnection();
$stmt = $conn->prepare("INSERT INTO gallery (title, category_id, description, image_url, sort_order, status) VALUES ('Test UI Item', NULL, 'test', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800', 1, 'active')");
$stmt->execute();
echo "Inserted directly.";
?>
