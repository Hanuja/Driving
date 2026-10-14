<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    
    $tables = ['courses', 'vehicles'];
    $schema = [];
    foreach ($tables as $t) {
        $stmt = $conn->query("DESCRIBE `$t`");
        $schema[$t] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    file_put_contents('c:/wamp64/www/Driving/schema_out.json', json_encode($schema, JSON_PRETTY_PRINT));
    echo "Done";
} catch (PDOException $e) {
    file_put_contents('c:/wamp64/www/Driving/schema_out.json', "Error: " . $e->getMessage());
}
