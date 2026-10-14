<?php
$file = 'c:\wamp64\www\Driving\backend\controllers\StudentController.php';
exec("C:\\wamp64\\bin\\php\\php8.3.28\\php.exe -l \"$file\"", $output, $return);
echo "Return: $return\n";
echo implode("\n", $output);
