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
    
    $query = "INSERT INTO branches (name, branch_code, description, address, city, district, postal_code, email, phone, alternative_phone, manager, opening_time, closing_time, latitude, longitude, google_maps_url, image_url, status) 
              VALUES (:name, :branch_code, :description, :address, :city, :district, :postal_code, :email, :phone, :alternative_phone, :manager, :opening_time, :closing_time, :latitude, :longitude, :google_maps_url, :image_url, :status)";
    
    $stmt = $conn->prepare($query);
    
    $stmt->execute([
        ':name' => 'Test Branch',
        ':branch_code' => 'TB-001',
        ':description' => null,
        ':address' => '',
        ':city' => null,
        ':district' => null,
        ':postal_code' => null,
        ':email' => null,
        ':phone' => null,
        ':alternative_phone' => null,
        ':manager' => null,
        ':opening_time' => null,
        ':closing_time' => null,
        ':latitude' => null,
        ':longitude' => null,
        ':google_maps_url' => null,
        ':image_url' => null,
        ':status' => 'Active'
    ]);

    echo "Success!";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
