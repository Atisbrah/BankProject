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
        // Ellenőrizzük a PIN kódot és a priority = 1 kártyát
        $userId = $_SESSION['user_id']; // Bejelentkezett felhasználó ID-ja
        $stmt = $connection->prepare("SELECT pin, cardnumber FROM card WHERE user_id = ? AND priority = 1 LIMIT 1");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($storedPin, $cardNumber);
        $stmt->fetch();
        $stmt->close();

        if (!$cardNumber) {
            $response['errors']['general'] = 'No primary card found.';
        } elseif (!password_verify($pin, $storedPin)) {
            $response['errors']['pin'] = 'Invalid PIN Code.';
        }
    }

    if (empty($response['errors'])) {
        // Frissítjük az egyenleget az elsődleges bankkártyán
        $updateQuery = "UPDATE card SET balance = balance + ? WHERE user_id = ? AND priority = 1";
        $updateStmt = $connection->prepare($updateQuery);
        $updateStmt->bind_param("di", $amount, $userId);

        if ($updateStmt->execute()) {
            // Rögzítjük a tranzakciót
            $transactionQuery = "INSERT INTO transaction (cardnumber, amount, statement, date) VALUES (?, ?, 'Deposit', NOW())";
            $transactionStmt = $connection->prepare($transactionQuery);
            $transactionStmt->bind_param("sd", $cardNumber, $amount);

            if ($transactionStmt->execute()) {
                $response['success'] = true;
                $response['redirect'] = 'randomQuote.php'; // Redirect after successful deposit
            } else {
                $response['errors']['general'] = 'An error occurred while recording the transaction. Please try again later.';
            }

            $transactionStmt->close();
        } else {
            $response['errors']['general'] = 'An error occurred while processing the deposit. Please try again later.';
        }

        $updateStmt->close();
    }
}

echo json_encode($response);
$connection->close();
?>
