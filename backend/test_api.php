<?php
$data = json_encode(["email" => "newadmin@ceylondrive.lk", "password" => "password123"]);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $data,
        'ignore_errors' => true
    ]
]);
$loginResp = file_get_contents('http://localhost/Driving/api/auth/login', false, $context);
$loginData = json_decode($loginResp, true);
$token = $loginData['data']['token'] ?? null;

if (!$token) {
    echo "Login failed. Response: $loginResp";
    exit;
}

$contextMe = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Authorization: Bearer $token\r\n",
        'ignore_errors' => true
    ]
]);
$meResp = file_get_contents('http://localhost/Driving/api/auth/me', false, $contextMe);
echo "Login Token: $token\n\n";
echo "Me Response: $meResp";
?>
