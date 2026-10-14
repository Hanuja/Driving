<?php
$method = $_GET['method'] ?? 'GET';
$url = 'http://localhost/Driving/api/branches' . ($_GET['path'] ?? '');

$options = [
    'http' => [
        'method' => $method,
        'header' => 'Content-Type: application/json',
        'ignore_errors' => true
    ]
];

if (in_array($method, ['POST', 'PUT'])) {
    $options['http']['content'] = json_encode([
        'name' => 'Test Branch API',
        'branch_code' => 'TB-API-01',
        'status' => 'Active'
    ]);
}

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>
