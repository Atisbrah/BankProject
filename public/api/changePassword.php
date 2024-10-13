<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'errors' => [],
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handlePostRequest($connection, $response);
}

echo json_encode($response);
$connection->close();

function handlePostRequest($connection, &$response) {
    $oldPassword = trim($_POST['old-password']);
    $newPassword = trim($_POST['new-password']);
    $confirmNewPassword = trim($_POST['confirm-new-password']);
    
    validateChangePasswordInputs($oldPassword, $newPassword, $confirmNewPassword, $response);
    
    if (empty($response['errors'])) {
        processChangePassword($connection, $oldPassword, $newPassword, $response);
    }
}

function validateChangePasswordInputs($oldPassword, $newPassword, $confirmNewPassword, &$response) {
    if (empty($oldPassword)) {
        $response['errors']['old-password'] = 'Old password is required.';
    }

    if (empty($newPassword)) {
        $response['errors']['new-password'] = 'New password is required.';
    } else {
        if (strlen($newPassword) < 6) {
            $response['errors']['new-password'] = 'Password must be at least 6 characters long.';
        } elseif (!preg_match('/[A-Z]/', $newPassword)) {
            $response['errors']['new-password'] = 'Password must contain at least one uppercase letter.';
        } elseif (!preg_match('/[0-9]/', $newPassword)) {
            $response['errors']['new-password'] = 'Password must contain at least one number.';
        }
        if ($oldPassword === $newPassword) {
            $response['errors']['new-password'] = 'New password cannot be the same as the old password.';
        }
    }

    if ($newPassword !== $confirmNewPassword) {
        $response['errors']['confirm-new-password'] = 'New passwords do not match.';
    }
}

function processChangePassword($connection, $oldPassword, $newPassword, &$response) {
    $userId = $_SESSION['user_id'];

    $query = "SELECT password FROM user WHERE id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if (password_verify($oldPassword, $hashedPassword)) {
            $hashedNewPassword = password_hash($newPassword, PASSWORD_BCRYPT);

            $updateQuery = "UPDATE user SET password = ? WHERE id = ?";
            $updateStmt = $connection->prepare($updateQuery);
            $updateStmt->bind_param("si", $hashedNewPassword, $userId);

            if ($updateStmt->execute()) {
                $response['success'] = true;
            } else {
                $response['errors']['general'] = 'An error occurred while updating the password. Please try again later.';
            }
            $updateStmt->close();
        } else {
            $response['errors']['old-password'] = 'Old password is incorrect.';
        }
    } else {
        $response['errors']['general'] = 'User not found.';
    }

    $stmt->close();
}
