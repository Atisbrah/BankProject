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
    $amount = trim($_POST['amount']);
    $pin = trim($_POST['pin']);
    
    // Validate amount
    if (empty($amount)) {
        $response['errors']['amount'] = 'Amount is required.';
    } else if (!is_numeric($amount) || $amount <= 0) {
        $response['errors']['amount'] = 'Amount must be a positive number.';
    }

    // Validate PIN
    if (empty($pin)) {
        $response['errors']['pin'] = 'PIN Code is required.';
    } else if (strlen($pin) !== 4 || !preg_match('/^\d{4}$/', $pin)) {
        $response['errors']['pin'] = 'PIN Code must be a 4-digit number.';
    } else {
        // Check PIN in the database
        $userId = $_SESSION['user_id'];
        $stmt = $connection->prepare("SELECT pin, cardnumber, balance FROM card WHERE user_id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($storedPin, $cardNumber, $balance);
        $stmt->fetch();
        $stmt->close();

        if (!password_verify($pin, $storedPin)) {
            $response['errors']['pin'] = 'Invalid PIN Code.';
        } else if ($amount > $balance) {
            $response['errors']['amount'] = 'Insufficient balance.';
        }
    }

    if (empty($response['errors'])) {
        // Convert the amount to negative for withdrawal
        $amount = -floatval($amount);
        
        // Update the user's balance
        $updateQuery = "UPDATE card SET balance = balance - ? WHERE user_id = ?";
        $updateStmt = $connection->prepare($updateQuery);
        $updateStmt->bind_param("di", $amount, $userId);

        if ($updateStmt->execute()) {
            // Record the transaction with negative amount
            $transactionQuery = "INSERT INTO transaction (cardnumber, amount, statement, date) VALUES (?, ?, 'Withdraw', NOW())";
            $transactionStmt = $connection->prepare($transactionQuery);
            $transactionStmt->bind_param("sd", $cardNumber, $amount);

            if ($transactionStmt->execute()) {
                $response['success'] = true;
                $response['redirect'] = 'randomQuote.php'; // Redirect after successful withdrawal
            } else {
                $response['errors']['general'] = 'An error occurred while recording the transaction. Please try again later.';
            }

            $transactionStmt->close();
        } else {
            $response['errors']['general'] = 'An error occurred while processing the withdrawal. Please try again later.';
        }

        $updateStmt->close();
    }
}

echo json_encode($response);
$connection->close();
?>
