<?php
require_once 'index.php'; // wait, index.php routes, so let's just connect directly

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
    $stmt = $db->query("SELECT * FROM admins");
    $admins = $stmt->fetchAll();
    print_r($admins);
}
