<?php
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
    
    $query = "SELECT b.*, 
              (SELECT COUNT(*) FROM instructors i WHERE i.branch_id = b.id) as instructor_count,
              (SELECT COUNT(*) FROM vehicles v WHERE v.branch_id = b.id) as vehicle_count
              FROM branches b ORDER BY b.id DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $branches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $branches]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
