<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    
    // get an admin
    $stmt = $conn->query("SELECT email, password_hash FROM admins LIMIT 1");
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // fake session token
    $token = "fake_token_123";
    session_id($token);
    session_start();
    $_SESSION['admin_id'] = 1;
    $_SESSION['admin_name'] = "Test Admin";
    $_SESSION['admin_email'] = $admin['email'];
    session_write_close();
    
    // Call the API via cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/Driving/api/students");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: Bearer $token"
    ));
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: " . $httpcode . "\n\n";
    echo "Raw Response:\n" . $response;
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
