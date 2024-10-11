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
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email)) {
        $response['errors']['email'] = 'Email is required.';
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Provide a valid email address.';
    }

    if (empty($password)) {
        $response['errors']['password'] = 'Password is required.';
    }

    if (empty($response['errors'])) {
        $query = "SELECT id, name, password, authority FROM user WHERE email = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($userId, $userName, $hashedPassword, $authority);
            $stmt->fetch();

            if (password_verify($password, $hashedPassword)) {
                if ($authority == 0) {
                    $response['errors']['authorization'] = 'Your account is not authorized to log in.';
                } else {
                    $_SESSION['user_id'] = $userId; 
                    $_SESSION['user_name'] = $userName;  
                    $_SESSION['user_authority'] = $authority;
                    
                    $response['success'] = true;
                    $response['redirect'] = 'randomQuote.php';
                }
            } else {
                $response['errors']['password'] = 'Incorrect password.';
            }
            
        } else {
            $response['errors']['email'] = 'No user found with this email address.';
        }

        $stmt->close();
    }
}

echo json_encode($response);
$connection->close();
?>
