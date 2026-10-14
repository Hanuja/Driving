<?php
class MigrateInstructorController {
    public function handleRequest() {
        $database = new Database();
        $conn = $database->getConnection();

        try {
            // Alter Instructors Table
            $conn->exec("ALTER TABLE instructors 
                ADD COLUMN IF NOT EXISTS instructor_code VARCHAR(50) NULL AFTER id,
                ADD COLUMN IF NOT EXISTS nic VARCHAR(20) NULL AFTER instructor_code,
                ADD COLUMN IF NOT EXISTS alternative_phone VARCHAR(50) NULL AFTER phone,
                ADD COLUMN IF NOT EXISTS date_of_birth DATE NULL AFTER alternative_phone,
                ADD COLUMN IF NOT EXISTS gender VARCHAR(20) NULL AFTER date_of_birth,
                ADD COLUMN IF NOT EXISTS address TEXT NULL AFTER gender,
                ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER address,
                ADD COLUMN IF NOT EXISTS license_number VARCHAR(50) NULL AFTER city,
                ADD COLUMN IF NOT EXISTS license_category VARCHAR(50) NULL AFTER license_number,
                ADD COLUMN IF NOT EXISTS license_expiry DATE NULL AFTER license_category,
                ADD COLUMN IF NOT EXISTS vehicle_id INT NULL AFTER license_expiry,
                ADD COLUMN IF NOT EXISTS assigned_courses TEXT NULL AFTER vehicle_id,
                ADD COLUMN IF NOT EXISTS availability ENUM('Available', 'Busy', 'On Leave') DEFAULT 'Available' AFTER assigned_courses,
                ADD COLUMN IF NOT EXISTS working_schedule TEXT NULL AFTER availability
            ");

            jsonResponse(true, 'Instructor migration completed successfully');
        } catch(PDOException $e) {
            jsonResponse(false, 'Migration failed: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
