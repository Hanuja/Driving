<?php
$data = [
    'title' => 'Sample Image',
    'image_url' => 'https://example.com/test.jpg',
    'category_id' => '',
    'description' => 'A test image',
    'sort_order' => 1,
    'status' => 'active'
];

$ch = curl_init('http://localhost/Driving/api/gallery');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    // We don't have a valid token here, but POST /api/gallery requires auth!
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpcode . "\n";
echo "Response: " . $response . "\n";
?>
