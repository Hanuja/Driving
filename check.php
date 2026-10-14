<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    
    $tables = ['about_page', 'about_features', 'about_statistics', 'banners', 'content'];
    $schema = [];
    foreach ($tables as $t) {
        try {
            $stmt = $conn->query("DESCRIBE `$t`");
            $schema[$t] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            $schema[$t] = "Does not exist";
        }
    }
    
    echo json_encode($schema, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo $e->getMessage();
}
