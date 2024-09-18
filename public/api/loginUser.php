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

    // Input ellenőrzés
    if (empty($email)) {
        $response['errors']['email'] = 'Email is required.';
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Provide a valid email address.';
    }

    if (empty($password)) {
        $response['errors']['password'] = 'Password is required.';
    }

    // Ha nincs hiba az inputban
    if (empty($response['errors'])) {
        // Felhasználó lekérdezése email alapján
        $query = "SELECT id, name, password FROM user WHERE email = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($userId, $userName, $hashedPassword); // Lekérdezzük a nevet is
            $stmt->fetch();

            if (password_verify($password, $hashedPassword)) {
                // Sikeres bejelentkezés
                $_SESSION['user_id'] = $userId;  // Felhasználó ID mentése session-be
                $_SESSION['user_name'] = $userName;  // Felhasználó neve mentése session-be
                
                $response['success'] = true;
                $response['redirect'] = 'randomQuote.php'; // Sikeres bejelentkezés utáni átirányítás
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
