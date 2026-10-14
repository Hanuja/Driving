<?php
require_once 'index.php'; // gets Database class

$db = new Database();
$conn = $db->getConnection();

$tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

$schema = [];
foreach ($tables as $table) {
    $columns = $conn->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_ASSOC);
    $schema[$table] = $columns;
}

header('Content-Type: application/json');
echo json_encode($schema, JSON_PRETTY_PRINT);
