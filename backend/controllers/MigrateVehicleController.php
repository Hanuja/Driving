<?php

class MigrateVehicleController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest()
    {
        try {
            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 0");

            $this->conn->exec("DROP TABLE IF EXISTS vehicles");

            $query = "
            CREATE TABLE vehicles (
                id INT(11) AUTO_INCREMENT PRIMARY KEY,
                vehicle_number VARCHAR(100) NOT NULL UNIQUE,
                registration_number VARCHAR(100) NOT NULL UNIQUE,
                brand VARCHAR(100) NOT NULL,
                model VARCHAR(100) NOT NULL,
                vehicle_type VARCHAR(100) NOT NULL,
                manufacturing_year INT(11) NOT NULL,
                color VARCHAR(50) NOT NULL,
                transmission ENUM('Manual', 'Automatic', 'Both') NOT NULL,
                fuel_type VARCHAR(50) NOT NULL,
                engine_capacity VARCHAR(50) NOT NULL,
                mileage INT(11) NOT NULL DEFAULT 0,
                license_category VARCHAR(50) NOT NULL,
                branch_id INT(11) NOT NULL,
                instructor_id INT(11) NULL,
                last_service_date DATE NULL,
                next_service_date DATE NULL,
                insurance_provider VARCHAR(100) NULL,
                insurance_policy_number VARCHAR(100) NULL,
                insurance_expiry DATE NULL,
                revenue_license_number VARCHAR(100) NULL,
                revenue_license_expiry DATE NULL,
                image VARCHAR(255) NULL,
                status ENUM('Available', 'Assigned', 'Maintenance', 'Inactive') DEFAULT 'Available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )";

            $this->conn->exec($query);

            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 1");

            jsonResponse(true, "Vehicles table migrated successfully");
        } catch (PDOException $e) {
            jsonResponse(false, "Migration failed: " . $e->getMessage(), null, 500);
        }
    }
}
?>
