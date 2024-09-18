<?php
session_start();
session_unset(); // Minden session változó törlése
session_destroy(); // Session bezárása

header('Content-Type: application/json');

$response = ['success' => true];

echo json_encode($response);
?>
