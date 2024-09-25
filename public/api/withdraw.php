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

// Main function to handle the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handlePostRequest($connection, $response);
}

// Send response as JSON
echo json_encode($response);
$connection->close();

/**
 * Main handler for the POST request.
 */
function handlePostRequest($connection, &$response) {
    $amount = trim($_POST['amount']);
    $pin = trim($_POST['pin']);
    $userId = $_SESSION['user_id']; // Bejelentkezett felhasználó ID-ja

    validateAmount($amount, $response);
    validatePin($pin, $response);

    if (empty($response['errors'])) {
        processWithdrawal($connection, $userId, $amount, $pin, $response);
    }
}

/**
 * Validates the amount input.
 */
function validateAmount($amount, &$response) {
    if (empty($amount)) {
        $response['errors']['amount'] = 'Amount is required.';
    } else if (!is_numeric($amount) || $amount <= 0) {
        $response['errors']['amount'] = 'Amount must be a positive number.';
    } else if ($amount > 9999999) {
        $response['errors']['amount'] = 'Amount must not exceed 9.999.999.';
    }
}

/**
 * Validates the PIN input.
 */
function validatePin($pin, &$response) {
    if (empty($pin)) {
        $response['errors']['pin'] = 'PIN Code is required.';
    } else if (strlen($pin) !== 4 || !preg_match('/^\d{4}$/', $pin)) {
        $response['errors']['pin'] = 'PIN Code must be a 4-digit number.';
    }
}

/**
 * Processes the withdrawal if the input is valid.
 */
function processWithdrawal($connection, $userId, $amount, $pin, &$response) {
    $cardDetails = getPrimaryCardDetails($connection, $userId);

    if (!$cardDetails) {
        $response['errors']['amount'] = 'No primary card found.';
        return;
    }

    list($storedPin, $cardNumber, $balance) = $cardDetails;

    if (!password_verify($pin, $storedPin)) {
        $response['errors']['pin'] = 'Invalid PIN Code.';
    } elseif ($balance <= 0 || $balance < $amount) {
        $response['errors']['amount'] = 'Insufficient funds on the primary card.';
    } else {
        updateBalanceAndRecordTransaction($connection, $userId, $amount, $cardNumber, $response);
    }
}

/**
 * Retrieves the primary card details for the user.
 */
function getPrimaryCardDetails($connection, $userId) {
    $stmt = $connection->prepare("SELECT pin, cardnumber, balance FROM card WHERE user_id = ? AND priority = 1 LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($storedPin, $cardNumber, $balance);
    $stmt->fetch();
    $stmt->close();

    return $cardNumber ? [$storedPin, $cardNumber, $balance] : false;
}

/**
 * Updates the card balance and records the transaction.
 */
function updateBalanceAndRecordTransaction($connection, $userId, $amount, $cardNumber, &$response) {
    $amount = -floatval($amount); // Mínusz jellel tároljuk az összeget
    $updateQuery = "UPDATE card SET balance = balance + ? WHERE user_id = ? AND priority = 1";
    $updateStmt = $connection->prepare($updateQuery);
    $updateStmt->bind_param("di", $amount, $userId);

    if ($updateStmt->execute()) {
        recordTransaction($connection, $cardNumber, $amount, $response);
    } else {
        $response['errors']['amount'] = 'An error occurred while processing the withdrawal. Please try again later.';
    }

    $updateStmt->close();
}

/**
 * Records the transaction in the database.
 */
function recordTransaction($connection, $cardNumber, $amount, &$response) {
    $transactionQuery = "INSERT INTO transaction (cardnumber, amount, statement, date) VALUES (?, ?, 'Withdraw', NOW())";
    $transactionStmt = $connection->prepare($transactionQuery);
    $transactionStmt->bind_param("sd", $cardNumber, $amount);

    if ($transactionStmt->execute()) {
        $response['success'] = true;
        $response['redirect'] = 'randomQuote.php'; // Redirect after successful withdrawal
    } else {
        $response['errors']['amount'] = 'An error occurred while recording the transaction. Please try again later.';
    }

    $transactionStmt->close();
}
?>
