<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = "CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT,
        setting_group VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
              
    $conn->exec($query);
    
    // Insert default settings if empty
    $check = $conn->query("SELECT COUNT(*) FROM settings");
    if ($check->fetchColumn() == 0) {
        $defaults = [
            ['site_name', 'Prime Driving School', 'general'],
            ['contact_email', 'contact@primedriving.com', 'contact'],
            ['contact_phone', '+94 77 123 4567', 'contact'],
            ['address', '123 Main Street, Colombo 01', 'contact'],
            ['currency', 'LKR', 'general'],
            ['registration_fee', '2500', 'finance'],
            ['enable_online_booking', 'true', 'features'],
            ['maintenance_mode', 'false', 'system']
        ];
        
        $stmt = $conn->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)");
        foreach ($defaults as $setting) {
            $stmt->execute($setting);
        }
    }
    
    echo "Settings table created and seeded successfully.";
} catch (Exception $e) {
    echo "Error creating table: " . $e->getMessage();
}
