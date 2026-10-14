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
    
    $output = "Seeding Branches...\n";
    
    $conn->exec("UPDATE branches SET name = 'Colombo Branch' WHERE name = 'Colombo Head Office'");
    
    $branches = [
        "Kurunegala Branch",
        "Negombo Branch",
        "Jaffna Branch",
        "Matara Branch"
    ];
    
    $stmt = $conn->prepare("INSERT INTO branches (name, address, status) VALUES (:name, 'TBD', 'Active')");
    foreach($branches as $b) {
        $check = $conn->prepare("SELECT id FROM branches WHERE name = ?");
        $check->execute([$b]);
        if(!$check->fetch()) {
            $stmt->execute([':name' => $b]);
        }
    }
    
    $colombo = $conn->query("SELECT id FROM branches WHERE name = 'Colombo Branch' LIMIT 1")->fetch();
    $branch_id = $colombo ? $colombo['id'] : 1;
    
    $output .= "Seeding Vehicles...\n";
    
    $vehicles = [
        ['vehicle_type' => 'Motor Bike', 'brand' => 'Honda', 'model' => 'CD 70'],
        ['vehicle_type' => 'Motor Bike', 'brand' => 'Yamaha', 'model' => ''],
        ['vehicle_type' => 'Car', 'brand' => 'Toyota', 'model' => 'Aqua'],
        ['vehicle_type' => 'Car', 'brand' => 'Toyota', 'model' => 'Vitz'],
        ['vehicle_type' => 'Car', 'brand' => 'Honda', 'model' => 'Fit'],
        ['vehicle_type' => 'Van', 'brand' => 'Nissan', 'model' => 'Caravan'],
        ['vehicle_type' => 'Van', 'brand' => 'Toyota', 'model' => 'Hiace'],
        ['vehicle_type' => 'Three Wheeler', 'brand' => 'Bajaj', 'model' => ''],
        ['vehicle_type' => 'Bus', 'brand' => 'Toyota', 'model' => 'Coaster'],
        ['vehicle_type' => 'Lorry', 'brand' => 'Mitsubishi', 'model' => 'Canter'],
        ['vehicle_type' => 'Heavy Vehicle', 'brand' => 'Ashok Leyland', 'model' => '']
    ];
    
    foreach($vehicles as $index => $v) {
        $check = $conn->prepare("SELECT id FROM vehicles WHERE vehicle_type = ? AND brand = ? AND model = ?");
        $check->execute([$v['vehicle_type'], $v['brand'], $v['model']]);
        if(!$check->fetch()) {
            $vehicle_number = "VEH-" . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            $reg_number = "REG-" . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            
            $insert = $conn->prepare("
                INSERT INTO vehicles 
                (vehicle_number, registration_number, vehicle_type, brand, model, transmission, fuel_type, status, instructor_id, branch_id, manufacturing_year, color, engine_capacity, mileage, license_category) 
                VALUES (?, ?, ?, ?, ?, 'Manual', 'Petrol', 'active', NULL, ?, 2020, 'White', '1000cc', 0, 'B')
            ");
            $insert->execute([
                $vehicle_number,
                $reg_number,
                $v['vehicle_type'],
                $v['brand'],
                $v['model'],
                $branch_id
            ]);
        }
    }
    
    $output .= "Database seeded successfully!";
} catch(PDOException $e) {
    $output .= "Error: " . $e->getMessage();
}

file_put_contents('seed_log4.txt', $output);
?>
