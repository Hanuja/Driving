<?php

class AuthController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();

        // Start PHP session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Handle authentication requests
     */
    public function handleRequest($method, $action, $input)
    {
        if ($method === 'POST' && $action === 'login') {

            $this->login($input);

        } elseif (
            ($method === 'POST' || $method === 'DELETE')
            && $action === 'logout'
        ) {

            $this->logout();

        } elseif ($method === 'GET' && $action === 'me') {

            self::requireAuth();
            $this->me();

        } elseif ($method === 'PUT' && $action === 'me') {

            self::requireAuth();
            $this->updateProfile($input);

        } else {
            jsonResponse(
                false,
                'Method not allowed for Auth. Method: ' . $method . ', Action: ' . $action,
                null,
                405
            );
        }
    }


    /**
     * LOGIN
     */
    private function login($input)
    {
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        // Validation
        if (empty($email) || empty($password)) {

            jsonResponse(
                false,
                'Email and password are required',
                null,
                400
            );

            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

            jsonResponse(
                false,
                'Invalid email address',
                null,
                400
            );

            return;
        }

        try {

            /*
             * Find admin by email
             */
            $query = "
                SELECT
                    id,
                    name,
                    email,
                    password_hash
                FROM admins
                WHERE email = :email
                LIMIT 1
            ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                ':email' => $email
            ]);

            $admin = $stmt->fetch(PDO::FETCH_ASSOC);


            /*
             * Email not found
             */
            if (!$admin) {

                jsonResponse(
                    false,
                    'Email not found',
                    null,
                    401
                );

                return;
            }


            /*
             * Check password
             */
            $isValidPassword = false;

            if (password_verify($password, $admin['password_hash'])) {
                $isValidPassword = true;
            } elseif ($password === $admin['password_hash']) {
                // If it matches plain text, upgrade to hash
                $isValidPassword = true;
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $this->conn->prepare("UPDATE admins SET password_hash = :hash WHERE id = :id");
                $updateStmt->execute([
                    ':hash' => $newHash,
                    ':id' => $admin['id']
                ]);
            }

            if (!$isValidPassword) {

                jsonResponse(
                    false,
                    'Invalid password',
                    null,
                    401
                );

                return;
            }


            /*
             * Regenerate session ID
             */
            session_regenerate_id(true);


            /*
             * Store admin information
             */
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['name'];
            $_SESSION['admin_email'] = $admin['email'];


            /*
             * Login successful
             */
            jsonResponse(
                true,
                'Login successful',
                [
                    'id' => $admin['id'],
                    'name' => $admin['name'],
                    'email' => $admin['email'],
                    'token' => session_id()
                ]
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
     * CURRENT ADMIN
     */
    private function me()
    {
        jsonResponse(
            true,
            'Authenticated',
            [
                'id' => $_SESSION['admin_id'],
                'name' => $_SESSION['admin_name'],
                'email' => $_SESSION['admin_email'] ?? null
            ]
        );
    }


    /**
     * UPDATE PROFILE
     */
    private function updateProfile($input)
    {
        $id = $_SESSION['admin_id'];

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';


        if (empty($name) || empty($email)) {

            jsonResponse(
                false,
                'Name and email are required',
                null,
                400
            );

            return;
        }


        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

            jsonResponse(
                false,
                'Invalid email address',
                null,
                400
            );

            return;
        }


        try {

            /*
             * Check duplicate email
             */
            $query = "
                SELECT id
                FROM admins
                WHERE email = :email
                AND id != :id
                LIMIT 1
            ";

            $stmt = $this->conn->prepare($query);

            $stmt->execute([
                ':email' => $email,
                ':id' => $id
            ]);

            if ($stmt->fetch()) {

                jsonResponse(
                    false,
                    'Email already exists',
                    null,
                    409
                );

                return;
            }


            /*
             * Update password if provided
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
             * Update session
             */
            $_SESSION['admin_name'] = $name;
            $_SESSION['admin_email'] = $email;


            jsonResponse(
                true,
                'Profile updated successfully',
                [
                    'id' => $id,
                    'name' => $name,
                    'email' => $email
                ]
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
     * LOGOUT
     */
    private function logout()
    {
        /*
         * Clear session
         */
        $_SESSION = [];


        /*
         * Delete session cookie
         */
        if (ini_get('session.use_cookies')) {

            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }


        /*
         * Destroy session
         */
        session_destroy();


        jsonResponse(
            true,
            'Logged out successfully'
        );
    }


    /**
     * GET AUTHORIZATION HEADER
     */
    private static function getAuthorizationHeader()
    {
        $authHeader = null;


        /*
         * Standard Apache header
         */
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }


        /*
         * Apache redirect header
         */
        if (
            !$authHeader
            && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])
        ) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }


        /*
         * Fallback
         */
        if (
            !$authHeader
            && function_exists('getallheaders')
        ) {

            $headers = getallheaders();

            foreach ($headers as $key => $value) {

                if (strtolower($key) === 'authorization') {
                    $authHeader = $value;
                    break;
                }
            }
        }


        return $authHeader;
    }


    /**
     * CHECK AUTH
     */
    private static function checkAuth()
    {
        /*
         * Start session
         */
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }


        /*
         * Existing session
         */
        if (isset($_SESSION['admin_id'])) {
            return true;
        }


        /*
         * Get Authorization header
         */
        $authHeader = self::getAuthorizationHeader();

        if (!$authHeader) {
            return false;
        }


        /*
         * Extract Bearer token
         */
        if (
            stripos(
                trim($authHeader),
                'Bearer '
            ) === 0
        ) {

            $token = trim(
                substr(
                    trim($authHeader),
                    7
                )
            );

        } else {

            $token = trim($authHeader);
        }


        if (empty($token)) {
            return false;
        }


        /*
         * Close current session
         */
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_write_close();
        }


        /*
         * Validate token format to prevent session_start() crashing
         * PHP session IDs only allow A-Z, a-z, 0-9, "-", and ","
         */
        if (!preg_match('/^[a-zA-Z0-9\-,]+$/', $token)) {
            return false;
        }

        /*
         * Use login token as session ID
         */
        session_id($token);

        /*
         * Start token session
         */
        session_start();


        /*
         * Check admin
         */
        if (isset($_SESSION['admin_id'])) {
            return true;
        }


        return false;
    }


    /**
     * REQUIRE AUTH
     */
    public static function requireAuth()
    {
        if (self::checkAuth()) {
            return true;
        }


        jsonResponse(
            false,
            'Unauthorized. Please login.',
            null,
            401
        );

        exit;
    }
}

?>