<?php
require_once 'index.php';
$db = new Database();
$conn = $db->getConnection();
$stmt = $conn->query("DESCRIBE students");
$cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($cols);
?>
