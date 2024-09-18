<?php
session_start();

header('Content-Type: application/json');

$response = [
    'loggedIn' => isset($_SESSION['user_id']) && !empty($_SESSION['user_id']),
];

echo json_encode($response);
?>
