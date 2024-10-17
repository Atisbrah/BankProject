<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'errors' => []
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    handlePostRequest($connection, $response);
}

echo json_encode($response);
$connection->close();

function handlePostRequest($connection, &$response) {
    $newName = trim($_POST['name']);
    $newEmail = trim($_POST['email']);

    validatePersonalInfoInputs($newName, $newEmail, $response);

    if (empty($response['errors'])) {
        processEditPersonalInfo($connection, $newName, $newEmail, $response);
    }
}

function validatePersonalInfoInputs($newName, $newEmail, &$response) {
    if (empty($newName)) {
        $response['errors']['name'] = 'Name is required.';
    } else if (strlen($newName) < 3) {
        $response['errors']['name'] = 'Name must be at least 3 characters long.';
    }

    if (empty($newEmail)) {
        $response['errors']['email'] = 'Email is required.';
    } else if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Provide a valid email address.';
    }
}

function processEditPersonalInfo($connection, $newName, $newEmail, &$response) {
    $userId = $_SESSION['user_id'];

    $query = "UPDATE user SET name = ?, email = ? WHERE id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssi", $newName, $newEmail, $userId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response['success'] = true;
    } else {
        $response['errors']['general'] = 'An error occurred while updating your personal information. Please try again later.';
    }

    $stmt->close();
}