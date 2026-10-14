<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    
    $query = "SELECT id, name, image FROM courses";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "data" => $courses]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
