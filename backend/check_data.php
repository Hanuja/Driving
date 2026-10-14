<?php
header("Content-Type: application/json");
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    $branches = $conn->query("SELECT * FROM branches")->fetchAll();
    $vehicles = $conn->query("SELECT * FROM vehicles")->fetchAll();
    
    echo json_encode(["branches" => $branches, "vehicles" => $vehicles]);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
