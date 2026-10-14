<?php
$url = 'http://localhost/Driving/api/auth/login';
$data = array('email' => 'hanujakodeeswaran@gmail.com', 'password' => 'password123');

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true // to get response even on 4xx/5xx
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response from API:\n";
echo $result;
?>
