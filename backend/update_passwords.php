<?php
class Database {
    private $host = "127.0.0.1";
    private $port = "3307";
    private $db_name = "driving_school_db";
    private $username = "root";
    private $password = "";
    public $conn;
    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $exception) {
            echo "Database connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

$db = (new Database())->getConnection();
if ($db) {
    // Check if newadmin exists
    $stmt = $db->prepare("SELECT id FROM admins WHERE email = 'newadmin@ceylondrive.lk'");
    $stmt->execute();
    if (!$stmt->fetch()) {
        // Insert newadmin@ceylondrive.lk
        $insert = $db->prepare("INSERT INTO admins (name, email, password_hash) VALUES ('New Admin', 'newadmin@ceylondrive.lk', :hash)");
        $insert->execute([':hash' => password_hash('password123', PASSWORD_DEFAULT)]);
        echo "Inserted newadmin@ceylondrive.lk with password123. ";
    }
    
    // Update all others to password123
    $newHash = password_hash('password123', PASSWORD_DEFAULT);
    $updateStmt = $db->prepare("UPDATE admins SET password_hash = :hash");
    $updateStmt->execute([':hash' => $newHash]);
    
    echo "Updated all admin passwords to 'password123'.";
}
