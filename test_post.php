<?php
$ch = curl_init('http://localhost/Driving/api/auth/login');
$payload = json_encode(array("email" => "newadmin@ceylondrive.lk", "password" => "password123"));
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "STATUS: $status\n";
echo "RESPONSE: $result\n";
?>
