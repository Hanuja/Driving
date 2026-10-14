<?php
class Database
{
    private $host = "127.0.0.1";
    private $port = "3307";
    private $db_name = "driving_school_db";
    private $username = "root";
    private $password = "";

    public $conn;

    public function getConnection()
    {
        $this->conn = null;
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $exception) {
            echo "Database connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

$db = new Database();
$conn = $db->getConnection();
$conn->exec("TRUNCATE TABLE admins");
$stmt = $conn->prepare("INSERT INTO admins (name, email, password_hash) VALUES ('Admin', 'admin@ceylondrive.lk', :hash)");
$stmt->execute([':hash' => password_hash('password123', PASSWORD_DEFAULT)]);
echo "Admin account reset: admin@ceylondrive.lk / password123";
?>
