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
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['confirmPassword']);
    $authority = 1;

    if (empty($name)) {
        $response['errors']['name'] = 'Name is required.';
    } else if (strlen($name) < 3) {
        $response['errors']['name'] = 'Name must be at least 3 characters long.';
    }

    if (empty($email)) {
        $response['errors']['email'] = 'Email is required.';
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Provide a valid email address.';
    }

    if (empty($password)) {
        $response['errors']['password'] = 'Password is required.';
    } else if (strlen($password) < 6 || !preg_match('/[A-Z]/', $password) || !preg_match('/\d/', $password)) {
        $response['errors']['password'] = 'Password must be at least 6 characters long, contain at least one uppercase letter and one number.';
    }

    if (empty($confirmPassword)) {
        $response['errors']['confirmPassword'] = 'Password confirmation is required.';
    } else if ($password !== $confirmPassword) {
        $response['errors']['confirmPassword'] = "Passwords don't match.";
    }

    if (empty($response['errors'])) {
        $query = "SELECT id FROM user WHERE email = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $response['errors']['email'] = 'This email is already registered.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $insertQuery = "INSERT INTO user (name, email, password, authority) VALUES (?, ?, ?, ?)";
            $insertStmt = $connection->prepare($insertQuery);
            $insertStmt->bind_param("sssi", $name, $email, $hashedPassword, $authority);

            if ($insertStmt->execute()) {
                $response['success'] = true;
                $response['redirect'] = 'randomQuote.php';
            } else {
                $response['errors']['general'] = 'An error occurred while registering. Please try again later.';
            }

            $insertStmt->close();
        }

        $stmt->close();
    }
}

echo json_encode($response);
$connection->close();
