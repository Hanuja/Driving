<?php

header("Content-Type: application/json; charset=UTF-8");

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
        try {

            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";

            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );

            return $this->conn;

        } catch (PDOException $e) {

            echo json_encode([
                "success" => false,
                "message" => "Database connection error",
                "error" => $e->getMessage()
            ]);

            exit;
        }
    }
}


try {

    $db = new Database();
    $conn = $db->getConnection();

    $email = "newadmin@ceylondrive.lk";
    $newPassword = "password123";


    /*
     * Check admin first
     */
    $check = $conn->prepare("
        SELECT id, name, email, password_hash
        FROM admins
        WHERE email = :email
        LIMIT 1
    ");

    $check->execute([
        ":email" => $email
    ]);

    $admin = $check->fetch();


    if (!$admin) {

        echo json_encode([
            "success" => false,
            "message" => "Admin not found",
            "email" => $email
        ], JSON_PRETTY_PRINT);

        exit;
    }


    /*
     * Generate new password hash
     */
    $hash = password_hash(
        $newPassword,
        PASSWORD_BCRYPT
    );


    /*
     * Update password
     */
    $update = $conn->prepare("
        UPDATE admins
        SET
            password_hash = :hash,
            updated_at = NOW()
        WHERE email = :email
    ");

    $update->execute([
        ":hash" => $hash,
        ":email" => $email
    ]);


    /*
     * Read password hash again
     */
    $verifyQuery = $conn->prepare("
        SELECT
            id,
            name,
            email,
            password_hash
        FROM admins
        WHERE email = :email
        LIMIT 1
    ");

    $verifyQuery->execute([
        ":email" => $email
    ]);

    $updatedAdmin = $verifyQuery->fetch();


    /*
     * Test password immediately
     */
    $passwordWorks = password_verify(
        $newPassword,
        $updatedAdmin["password_hash"]
    );


    echo json_encode([
        "success" => true,
        "message" => "Password reset test completed",

        "database" => [
            "host" => "127.0.0.1",
            "port" => "3307",
            "database" => "driving_school_db"
        ],

        "admin" => [
            "id" => $updatedAdmin["id"],
            "name" => $updatedAdmin["name"],
            "email" => $updatedAdmin["email"]
        ],

        "password" => $newPassword,

        "password_test" => $passwordWorks,

        "hash_length" => strlen(
            $updatedAdmin["password_hash"]
        ),

        "hash_prefix" => substr(
            $updatedAdmin["password_hash"],
            0,
            7
        )

    ], JSON_PRETTY_PRINT);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>