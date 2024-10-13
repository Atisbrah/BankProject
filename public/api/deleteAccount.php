<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'errors' => [],
    'redirect' => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'];
    $password = trim($_POST['password']);

    if (empty($password)) {
        $response['errors']['general'] = 'Password is required.';
        echo json_encode($response);
        exit();
    }

    $query = "SELECT password FROM user WHERE id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $updateQuery = "UPDATE user SET authority = 0 WHERE id = ?";
            $updateStmt = $connection->prepare($updateQuery);
            $updateStmt->bind_param("i", $userId);

            if ($updateStmt->execute()) {
                $response['success'] = true;
                session_unset();
                session_destroy();
            } else {
                $response['errors']['general'] = 'Failed to delete user.';
            }
            $updateStmt->close();
        } else {
            $response['errors']['general'] = 'Incorrect password.';
        }
    } else {
        $response['errors']['general'] = 'User not found.';
    }

    $stmt->close();
}

echo json_encode($response);
$connection->close();