<?php
require_once 'index.php'; // get Database connection
$db = new Database();
$conn = $db->getConnection();
$tables = ['contact_messages', 'gallery', 'gallery_categories', 'faqs', 'faq_categories', 'about_page', 'about_features', 'about_statistics', 'banners', 'settings', 'notifications'];
$existing = [];
foreach ($tables as $t) {
    $stmt = $conn->prepare("SHOW TABLES LIKE '$t'");
    $stmt->execute();
    if ($stmt->rowCount() > 0) {
        $existing[] = $t;
    }
}
echo json_encode(["existing" => $existing, "missing" => array_diff($tables, $existing)]);
