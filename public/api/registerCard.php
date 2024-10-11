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
    $cardNumber = trim($_POST['cardNumber']);
    $pin = trim($_POST['pin']);
    $confirmPin = trim($_POST['confirmPin']);
    $balance = 0; 
    $status = 0;

    if (empty($cardNumber)) {
        $response['errors']['cardNumber'] = 'Card Number is required.';
    } else if (!preg_match('/^\d{4}-\d{4}-\d{4}-\d{4}$/', $cardNumber)) {
        $response['errors']['cardNumber'] = 'Card Number must be in the format 0000-0000-0000-0000.';
    }

    if (empty($pin)) {
        $response['errors']['pin'] = 'PIN Code is required.';
    } else if (strlen($pin) !== 4 || !ctype_digit($pin)) {
        $response['errors']['pin'] = 'PIN Code must be a 4-digit number.';
    }

    if (empty($confirmPin)) {
        $response['errors']['confirmPin'] = 'Confirm PIN Code is required.';
    } else if ($pin !== $confirmPin) {
        $response['errors']['confirmPin'] = "PIN codes don't match.";
    }

    if (empty($response['errors'])) {
        $userId = $_SESSION['user_id']; 

        $checkCardQuery = "SELECT COUNT(*) as card_exists FROM card WHERE cardnumber = ?";
        $checkCardStmt = $connection->prepare($checkCardQuery);
        $checkCardStmt->bind_param("s", $cardNumber);
        $checkCardStmt->execute();
        $checkCardResult = $checkCardStmt->get_result();
        $row = $checkCardResult->fetch_assoc();

        if ($row['card_exists'] > 0) {
            $response['errors']['cardNumber'] = 'This card number is already registered.';
        } else {
            $checkQuery = "SELECT COUNT(*) as card_count FROM card WHERE user_id = ? AND priority = 1";
            $checkStmt = $connection->prepare($checkQuery);
            $checkStmt->bind_param("i", $userId);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            $row = $checkResult->fetch_assoc();
            $cardCount = $row['card_count'];

            $priority = ($cardCount > 0) ? 0 : 1; 

            $hashedPin = password_hash($pin, PASSWORD_BCRYPT);

            $insertQuery = "INSERT INTO card (cardnumber, balance, user_id, pin, status, priority) VALUES (?, ?, ?, ?, ?, ?)";
            $insertStmt = $connection->prepare($insertQuery);
            $insertStmt->bind_param("siisii", $cardNumber, $balance, $userId, $hashedPin, $status, $priority);

            if ($insertStmt->execute()) {
                $response['success'] = true;
                $response['redirect'] = 'randomQuote.php'; 
            } else {
                $response['errors']['general'] = 'An error occurred while registering the card. Please try again later.';
            }

            $insertStmt->close();
            $checkStmt->close();
        }
        $checkCardStmt->close();
    }
}

echo json_encode($response);
$connection->close();
?>
