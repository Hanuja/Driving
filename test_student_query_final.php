<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = "SELECT s.*, 
                     c.name as course_name, 
                     i.name as instructor_name, 
                     v.vehicle_number 
              FROM students s
              LEFT JOIN courses c ON s.course_id = c.id
              LEFT JOIN instructors i ON s.instructor_id = i.id
              LEFT JOIN vehicles v ON s.vehicle_id = v.id
              ORDER BY s.id DESC";
              
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $students]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
