<?php

header("Content-Type: text/plain; charset=UTF-8");

require_once "Database.php";

echo "========================================\n";
echo "DATABASE TEST\n";
echo "========================================\n\n";

try {

    // ------------------------------------
    // 1. DATABASE CONNECTION
    // ------------------------------------

    $db = new Database();
    $conn = $db->getConnection();

    $result = $conn->query("
        SELECT
            DATABASE() AS database_name,
            @@hostname AS hostname,
            @@port AS port,
            USER() AS mysql_user,
            VERSION() AS mysql_version
    ");

    $dbInfo = $result->fetch(PDO::FETCH_ASSOC);

    print_r($dbInfo);

    echo "\n";


    // ------------------------------------
    // 2. CHECK ADMINS TABLE
    // ------------------------------------

    echo "========================================\n";
    echo "ADMINS TABLE\n";
    echo "========================================\n\n";

    $stmt = $conn->query("
        SELECT
            id,
            name,
            email,
            password_hash
        FROM admins
        ORDER BY id ASC
    ");

    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($admins)) {

        echo "NO ADMINS FOUND!\n\n";

    } else {

        foreach ($admins as $admin) {

            echo "ID: " . $admin['id'] . "\n";
            echo "Name: " . $admin['name'] . "\n";
            echo "Email: " . $admin['email'] . "\n";
            echo "Hash: " . $admin['password_hash'] . "\n";
            echo "Hash Length: " . strlen($admin['password_hash']) . "\n";
            echo "----------------------------------------\n";
        }
    }


    // ------------------------------------
    // 3. TEST LOGIN API
    // ------------------------------------

    echo "\n";
    echo "========================================\n";
    echo "LOGIN API TEST\n";
    echo "========================================\n\n";

    $loginUrl =
        "http://localhost/Driving/api/auth/login";

    $loginData = json_encode([
        "email" => "newadmin@ceylondrive.lk",
        "password" => "password123"
    ]);

    $loginContext = stream_context_create([
        "http" => [
            "method" => "POST",

            "header" =>
                "Content-Type: application/json\r\n" .
                "Accept: application/json\r\n",

            "content" => $loginData,

            "ignore_errors" => true
        ]
    ]);


    $loginResp = file_get_contents(
        $loginUrl,
        false,
        $loginContext
    );


    if ($loginResp === false) {

        echo "LOGIN REQUEST FAILED\n";

        exit;
    }


    echo "Login Response:\n";
    echo $loginResp;
    echo "\n\n";


    // ------------------------------------
    // 4. DECODE LOGIN
    // ------------------------------------

    $loginResult = json_decode(
        $loginResp,
        true
    );


    if (!is_array($loginResult)) {

        echo "Could not decode login JSON.\n";

        exit;
    }


    if (
        !isset($loginResult['success'])
        || $loginResult['success'] !== true
    ) {

        echo "LOGIN FAILED.\n";
        echo "Message: " .
            ($loginResult['message'] ?? 'Unknown error') .
            "\n";

        exit;
    }


    // ------------------------------------
    // 5. GET TOKEN
    // ------------------------------------

    $token =
        $loginResult['data']['token']
        ?? null;


    if (!$token) {

        echo "LOGIN SUCCESSFUL BUT TOKEN NOT FOUND.\n";

        exit;
    }


    echo "========================================\n";
    echo "TOKEN\n";
    echo "========================================\n\n";

    echo $token;
    echo "\n\n";


    // ------------------------------------
    // 6. TEST /AUTH/ME
    // ------------------------------------

    echo "========================================\n";
    echo "AUTH/ME TEST\n";
    echo "========================================\n\n";


    $meUrl =
        "http://localhost/Driving/api/auth/me";


    $meContext = stream_context_create([
        "http" => [
            "method" => "GET",

            "header" =>
                "Authorization: Bearer " .
                $token .
                "\r\n" .
                "Accept: application/json\r\n",

            "ignore_errors" => true
        ]
    ]);


    $meResp = file_get_contents(
        $meUrl,
        false,
        $meContext
    );


    if ($meResp === false) {

        echo "AUTH/ME REQUEST FAILED\n";

        exit;
    }


    echo "Me Response:\n";
    echo $meResp;
    echo "\n\n";


    // ------------------------------------
    // 7. FINAL RESULT
    // ------------------------------------

    echo "========================================\n";
    echo "FINAL RESULT\n";
    echo "========================================\n\n";

    echo "Database: ";
    echo $dbInfo['database_name'] ?? 'Unknown';
    echo "\n";

    echo "Database Port: ";
    echo $dbInfo['port'] ?? 'Unknown';
    echo "\n";

    echo "Admin Count: ";
    echo count($admins);
    echo "\n";

    echo "Login: SUCCESS\n";

    echo "Token: SUCCESS\n";

    echo "Auth/Me: TESTED\n";

} catch (PDOException $e) {

    echo "\nDATABASE ERROR:\n";
    echo $e->getMessage();
}
?>