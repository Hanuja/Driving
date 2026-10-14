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
    
    // Hash 'password123'
    $newHash = password_hash('password123', PASSWORD_DEFAULT);
    
    // Reset both admin passwords to 'password123'
    $stmt = $conn->prepare("UPDATE admins SET password_hash = :hash");
    $stmt->execute([':hash' => $newHash]);
    
    echo "Successfully forced ALL admin passwords to 'password123'";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
