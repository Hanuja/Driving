<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Test inserting without category_id (null)
    $query = "INSERT INTO gallery (title, category_id, description, image_url, sort_order, status) 
              VALUES (:title, :category_id, :description, :image_url, :sort_order, :status)";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':title' => 'Test Item',
        ':category_id' => null,
        ':description' => 'Test description',
        ':image_url' => 'https://via.placeholder.com/150',
        ':sort_order' => 0,
        ':status' => 'active'
    ]);
    
    echo "Success! ID: " . $conn->lastInsertId() . "\n";
    
    // Delete it
    $conn->query("DELETE FROM gallery WHERE title='Test Item'");
    echo "Cleaned up test item\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
