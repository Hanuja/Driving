<?php
require_once 'index.php';
$db = new Database();
$conn = $db->getConnection();
$tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
if (in_array('students', $tables)) {
    echo "students table EXISTS\n";
    $columns = $conn->query("DESCRIBE students")->fetchAll(PDO::FETCH_ASSOC);
    print_r($columns);
} else {
    echo "students table DOES NOT EXIST\n";
}
?>
