<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/Driving/api/students");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
// Without token first, should return 401
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpcode . "\n\n";
echo "Raw Response:\n" . $response;
