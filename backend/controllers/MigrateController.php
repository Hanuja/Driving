<?php
class MigrateController {
    public function handleRequest() {
        $database = new Database();
        $conn = $database->getConnection();

        try {
            // Alter Branches
            $conn->exec("ALTER TABLE branches 
                ADD COLUMN IF NOT EXISTS branch_code VARCHAR(50) NULL AFTER name,
                ADD COLUMN IF NOT EXISTS description TEXT NULL AFTER branch_code,
                ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER address,
                ADD COLUMN IF NOT EXISTS district VARCHAR(100) NULL AFTER city,
                ADD COLUMN IF NOT EXISTS postal_code VARCHAR(50) NULL AFTER district,
                ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL AFTER phone,
                ADD COLUMN IF NOT EXISTS alternative_phone VARCHAR(50) NULL AFTER email,
                ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) NULL AFTER google_maps_url,
                ADD COLUMN IF NOT EXISTS status ENUM('Active','Inactive') DEFAULT 'Active' AFTER image_url,
                ADD COLUMN IF NOT EXISTS opening_time TIME NULL AFTER opening_hours,
                ADD COLUMN IF NOT EXISTS closing_time TIME NULL AFTER opening_time
            ");

            // Check and add branch_id to instructors
            $conn->exec("ALTER TABLE instructors ADD COLUMN IF NOT EXISTS branch_id INT NULL AFTER id");
            
            // Check and add branch_id to vehicles
            $conn->exec("ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS branch_id INT NULL AFTER id");
            
            // Check and add branch_id to students
            $conn->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS branch_id INT NULL AFTER id");
            
            // Check and add branch_id to bookings
            $conn->exec("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS branch_id INT NULL AFTER id");
            
            // Note: courses features column is already longtext
            // we will store features as JSON string in the courses table 'features' column.

            jsonResponse(true, 'Migration completed successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Migration failed: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
