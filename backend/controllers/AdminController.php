<?php

require_once 'AuthController.php';

class AdminController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();

        // Make sure session is started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }


    /**
     * Handle Admin API Requests
     */
    public function handleRequest($method, $id, $input)
    {
        switch ($method) {

            /**
             * GET
             * /admins
             * /admins/{id}
             */
            case 'GET':

                AuthController::requireAuth();

                if (!empty($id)) {
                    $this->getAdmin($id);
                } else {
                    $this->getAdmins();
                }

                break;


            /**
             * POST
             * /admins
             *
             * Used to create admin.
             *
             * IMPORTANT:
             * This is currently public so you can
             * create the first admin.
             */
            case 'POST':

                $this->createAdmin($input);

                break;


            /**
             * PUT
             * /admins/{id}
             */
            case 'PUT':

                AuthController::requireAuth();

                if (empty($id)) {

                    jsonResponse(
                        false,
                        'Admin ID is required',
                        null,
                        400
                    );

                    return;
                }

                $this->updateAdmin($id, $input);

                break;


            /**
             * DELETE
             * /admins/{id}
             */
            case 'DELETE':

                AuthController::requireAuth();

                if (empty($id)) {

                    jsonResponse(
                        false,
                        'Admin ID is required',
                        null,
                        400
                    );

                    return;
                }

                $this->deleteAdmin($id);

                break;


            default:

                jsonResponse(
                    false,
                    'Method not allowed for Admins',
                    null,
                    405
                );
        }
    }


    /**
     * GET ALL ADMINS
     *
     * GET /admins
     */
    private function getAdmins()
    {
        try {

            $query = "
                SELECT
                    id,
                    name,
                    email,
                    created_at,
                    updated_at
                FROM admins
                ORDER BY id ASC
            ";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse(
                true,
                'Admins retrieved successfully',
                $admins
            );

        } catch (PDOException $e) {

            jsonResponse(
                false,
                'Database error',
                null,
                500
            );
        }
    }


    /**
     * GET ONE ADMIN
     *
     * GET /admins/{id}
     */
    private function getAdmin($id)
    {
        try {

            $query = "
                SELECT
                    id,
                    name,
                    email,
                    created_at,
                    updated_at
                FROM admins
                WHERE id = :id
                LIMIT 1
            ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                ':id' => $id
            ]);

            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$admin) {

                jsonResponse(
                    false,
                    'Admin not found',
                    null,
                    404
                );

                return;
            }

            jsonResponse(
                true,
                'Admin retrieved successfully',
                $admin
            );

        } catch (PDOException $e) {

            jsonResponse(
                false,
                'Database error',
                null,
                500
            );
        }
    }


    /**
     * CREATE ADMIN
     *
     * POST /admins
     */
    private function createAdmin($input)
    {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';


        /*
         * Validate required fields
         */
        if (
            empty($name) ||
            empty($email) ||
            empty($password)
        ) {

            jsonResponse(
                false,
                'Name, email, and password are required',
                null,
                400
            );

            return;
        }


        /*
         * Validate email
         */
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

            jsonResponse(
                false,
                'Invalid email address',
                null,
                400
            );

            return;
        }


        /*
         * Password length
         */
        if (strlen($password) < 6) {

            jsonResponse(
                false,
                'Password must be at least 6 characters',
                null,
                400
            );

            return;
        }


        try {

            /*
             * Check duplicate email
             */
            $checkQuery = "
                SELECT id
                FROM admins
                WHERE email = :email
                LIMIT 1
            ";

            $checkStmt = $this->conn->prepare($checkQuery);

            $checkStmt->execute([
                ':email' => $email
            ]);

            if ($checkStmt->fetch()) {

                jsonResponse(
                    false,
                    'Email already exists',
                    null,
                    409
                );

                return;
            }


            /*
             * Hash password
             */
            $passwordHash = password_hash(
                $password,
                PASSWORD_DEFAULT
            );


            /*
             * Insert admin
             */
            $query = "
                INSERT INTO admins
                (
                    name,
                    email,
                    password_hash
                )
                VALUES
                (
                    :name,
                    :email,
                    :password_hash
                )
            ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':password_hash' => $passwordHash
            ]);


            $newId = $this->conn->lastInsertId();


            jsonResponse(
                true,
                'Admin created successfully',
                [
                    'id' => $newId,
                    'name' => $name,
                    'email' => $email
                ],
                201
            );

        } catch (PDOException $e) {

            /*
             * Duplicate email database error
             */
            if ($e->getCode() === '23000') {

                jsonResponse(
                    false,
                    'Email already exists',
                    null,
                    409
                );

                return;
            }


            jsonResponse(
                false,
                'Database error',
                null,
                500
            );
        }
    }


    /**
     * UPDATE ADMIN
     *
     * PUT /admins/{id}
     */
    private function updateAdmin($id, $input)
    {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';


        /*
         * Validate
         */
        if (empty($name) || empty($email)) {

            jsonResponse(
                false,
                'Name and email are required',
                null,
                400
            );

            return;
        }


        /*
         * Validate email
         */
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

            jsonResponse(
                false,
                'Invalid email address',
                null,
                400
            );

            return;
        }


        /*
         * Validate password if provided
         */
        if (
            !empty($password)
            && strlen($password) < 6
        ) {

            jsonResponse(
                false,
                'Password must be at least 6 characters',
                null,
                400
            );

            return;
        }


        try {

            /*
             * Check admin exists
             */
            $checkAdmin = $this->conn->prepare("
                SELECT id
                FROM admins
                WHERE id = :id
                LIMIT 1
            ");

            $checkAdmin->execute([
                ':id' => $id
            ]);

            if (!$checkAdmin->fetch()) {

                jsonResponse(
                    false,
                    'Admin not found',
                    null,
                    404
                );

                return;
            }


            /*
             * Check duplicate email
             */
            $checkEmail = $this->conn->prepare("
                SELECT id
                FROM admins
                WHERE email = :email
                AND id != :id
                LIMIT 1
            ");

            $checkEmail->execute([
                ':email' => $email,
                ':id' => $id
            ]);

            if ($checkEmail->fetch()) {

                jsonResponse(
                    false,
                    'Email already exists',
                    null,
                    409
                );

                return;
            }


            /*
             * Update with password
             */
            if (!empty($password)) {

                $passwordHash = password_hash(
                    $password,
                    PASSWORD_DEFAULT
                );

                $query = "
                    UPDATE admins
                    SET
                        name = :name,
                        email = :email,
                        password_hash = :password_hash,
                        updated_at = NOW()
                    WHERE id = :id
                ";

                $stmt = $this->conn->prepare($query);

                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':password_hash' => $passwordHash,
                    ':id' => $id
                ]);

            } else {

                /*
                 * Update without password
                 */
                $query = "
                    UPDATE admins
                    SET
                        name = :name,
                        email = :email,
                        updated_at = NOW()
                    WHERE id = :id
                ";

                $stmt = $this->conn->prepare($query);

                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':id' => $id
                ]);
            }


            /*
             * If updating currently logged-in admin,
             * update session information too.
             */
            if (
                isset($_SESSION['admin_id'])
                && $_SESSION['admin_id'] == $id
            ) {

                $_SESSION['admin_name'] = $name;
                $_SESSION['admin_email'] = $email;
            }


            jsonResponse(
                true,
                'Admin updated successfully',
                [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email
                ]
            );

        } catch (PDOException $e) {

            if ($e->getCode() === '23000') {

                jsonResponse(
                    false,
                    'Email already exists',
                    null,
                    409
                );

                return;
            }


            jsonResponse(
                false,
                'Database error',
                null,
                500
            );
        }
    }


    /**
     * DELETE ADMIN
     *
     * DELETE /admins/{id}
     */
    private function deleteAdmin($id)
    {
        try {

            /*
             * Don't allow admin to delete
             * their own logged-in account.
             */
            if (
                isset($_SESSION['admin_id'])
                && $_SESSION['admin_id'] == $id
            ) {

                jsonResponse(
                    false,
                    'You cannot delete your own account',
                    null,
                    403
                );

                return;
            }


            /*
             * Check admin exists
             */
            $check = $this->conn->prepare("
                SELECT id
                FROM admins
                WHERE id = :id
                LIMIT 1
            ");

            $check->execute([
                ':id' => $id
            ]);

            if (!$check->fetch()) {

                jsonResponse(
                    false,
                    'Admin not found',
                    null,
                    404
                );

                return;
            }


            /*
             * Delete
             */
            $query = "
                DELETE FROM admins
                WHERE id = :id
            ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                ':id' => $id
            ]);


            jsonResponse(
                true,
                'Admin deleted successfully'
            );

        } catch (PDOException $e) {

            jsonResponse(
                false,
                'Database error',
                null,
                500
            );
        }
    }
}

?>