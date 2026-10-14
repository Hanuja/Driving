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
    
    echo "Migrating branches table...\n";
    
    // Check and add branch_code
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN branch_code VARCHAR(100) UNIQUE AFTER name");
        echo "Added branch_code\n";
    } catch(PDOException $e) { echo "branch_code might exist: " . $e->getMessage() . "\n"; }

    // Check and add description
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN description TEXT AFTER branch_code");
        echo "Added description\n";
    } catch(PDOException $e) { echo "description might exist: " . $e->getMessage() . "\n"; }

    // Check and add city
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN city VARCHAR(100) AFTER address");
        echo "Added city\n";
    } catch(PDOException $e) { echo "city might exist: " . $e->getMessage() . "\n"; }

    // Check and add district
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN district VARCHAR(100) AFTER city");
        echo "Added district\n";
    } catch(PDOException $e) { echo "district might exist: " . $e->getMessage() . "\n"; }

    // Check and add postal_code
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN postal_code VARCHAR(50) AFTER district");
        echo "Added postal_code\n";
    } catch(PDOException $e) { echo "postal_code might exist: " . $e->getMessage() . "\n"; }

    // Check and add email
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN email VARCHAR(191) AFTER phone");
        echo "Added email\n";
    } catch(PDOException $e) { echo "email might exist: " . $e->getMessage() . "\n"; }

    // Check and add alternative_phone
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN alternative_phone VARCHAR(50) AFTER email");
        echo "Added alternative_phone\n";
    } catch(PDOException $e) { echo "alternative_phone might exist: " . $e->getMessage() . "\n"; }

    // Check and add opening_time
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN opening_time TIME AFTER opening_hours");
        echo "Added opening_time\n";
    } catch(PDOException $e) { echo "opening_time might exist: " . $e->getMessage() . "\n"; }

    // Check and add closing_time
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN closing_time TIME AFTER opening_time");
        echo "Added closing_time\n";
    } catch(PDOException $e) { echo "closing_time might exist: " . $e->getMessage() . "\n"; }

    // Check and add image_url
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN image_url VARCHAR(255) AFTER google_maps_url");
        echo "Added image_url\n";
    } catch(PDOException $e) { echo "image_url might exist: " . $e->getMessage() . "\n"; }

    // Check and add status
    try {
        $conn->exec("ALTER TABLE branches ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER image_url");
        echo "Added status\n";
    } catch(PDOException $e) { echo "status might exist: " . $e->getMessage() . "\n"; }

    echo "Migration completed!\n";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
