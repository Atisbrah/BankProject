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
    $oldPassword = trim($_POST['old-password']);
    $newPassword = trim($_POST['new-password']);
    $confirmNewPassword = trim($_POST['confirm-new-password']);

    if (empty($oldPassword)) {
        $response['errors']['old-password'] = 'Old password is required.';
    }

    if (empty($newPassword)) {
        $response['errors']['new-password'] = 'New password is required.';
    }

    if ($newPassword !== $confirmNewPassword) {
        $response['errors']['confirm-new-password'] = 'New passwords do not match.';
    }

    if (empty($response['errors'])) {
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
}

echo json_encode($response);
$connection->close();
?>
