<?php
session_start();
session_unset();
session_destroy();

header('Content-Type: application/json');

$response = ['success' => true];

echo json_encode($response);
?>
