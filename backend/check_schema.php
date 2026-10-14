<?php
header("Content-Type: text/plain");
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    $stmt = $conn->query("DESCRIBE vehicles");
    $schema = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($schema);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
