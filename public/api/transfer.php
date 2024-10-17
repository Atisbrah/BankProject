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
    handlePostRequest($connection, $response);
}

echo json_encode($response);
$connection->close();

function handlePostRequest($connection, &$response) {
    $targetCardNumber = trim($_POST['cardNumber']);
    $amount = trim($_POST['amount']);
    $pin = trim($_POST['pin']);
    $statement = trim($_POST['statement']);
    $userId = $_SESSION['user_id'];

    validateCardNumber($targetCardNumber, $connection, $response);
    validateAmount($amount, $response);
    validatePin($pin, $response);

    if (empty($response['errors'])) {
        processTransfer($connection, $userId, $targetCardNumber, $amount, $pin, $statement, $response);
    }
}

function validateCardNumber($targetCardNumber, $connection, &$response) {
    if (empty($targetCardNumber)) {
        $response['errors']['cardNumber'] = 'Card number is required.';
    } else {
        $stmt = $connection->prepare("SELECT status FROM card WHERE cardnumber = ?");
        $stmt->bind_param("s", $targetCardNumber);
        $stmt->execute();
        $stmt->bind_result($status);
        $stmt->fetch();

        if ($status === null) {
            $response['errors']['cardNumber'] = 'Card number does not exist.';
        } elseif ($status != 1) {
            $response['errors']['cardNumber'] = 'Transfer not allowed. The card is either inactive or blocked.';
        }

        $stmt->close();
    }
}


function validateAmount($amount, &$response) {
    if (empty($amount)) {
        $response['errors']['amount'] = 'Amount is required.';
    } else if (!is_numeric($amount) || $amount <= 0) {
        $response['errors']['amount'] = 'Amount must be a positive number.';
    } else if ($amount > 9999999) {
        $response['errors']['amount'] = 'Amount must not exceed 9,999,999.';
    }
}

function validatePin($pin, &$response) {
    if (empty($pin)) {
        $response['errors']['pin'] = 'PIN Code is required.';
    } else if (strlen($pin) !== 4 || !preg_match('/^\d{4}$/', $pin)) {
        $response['errors']['pin'] = 'PIN Code must be a 4-digit number.';
    }
}

function processTransfer($connection, $userId, $targetCardNumber, $amount, $pin, $statement, &$response) {
    $cardDetails = getPrimaryCardDetails($connection, $userId);

    if (!$cardDetails) {
        $response['errors']['amount'] = 'No primary card found.';
        return;
    }

    list($storedPin, $sourceCardNumber, $balance) = $cardDetails;

    if (!password_verify($pin, $storedPin)) {
        $response['errors']['pin'] = 'Invalid PIN Code.';
    } elseif ($balance < $amount) {
        $response['errors']['amount'] = 'Insufficient funds on the primary card.';
    } else {
        $targetUserName = getCardHolderName($connection, $targetCardNumber);

        $currentUserName = $_SESSION['user_name'];

        $sourceStatement = empty($statement) ? "Transfer to: " . $targetUserName : $statement;
        $targetStatement = "Transfer from: " . $currentUserName;

        transferAmount($connection, $sourceCardNumber, $targetCardNumber, $amount, $sourceStatement, $targetStatement, $response);
    }
}

function getPrimaryCardDetails($connection, $userId) {
    $stmt = $connection->prepare("SELECT pin, cardnumber, balance FROM card WHERE user_id = ? AND priority = 1 LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($storedPin, $cardNumber, $balance);
    $stmt->fetch();
    $stmt->close();

    return $cardNumber ? [$storedPin, $cardNumber, $balance] : false;
}

function getCardHolderName($connection, $cardNumber) {
    $stmt = $connection->prepare("SELECT u.name FROM card c JOIN user u ON c.user_id = u.id WHERE c.cardnumber = ?");
    $stmt->bind_param("s", $cardNumber);
    $stmt->execute();
    $stmt->bind_result($userName);
    $stmt->fetch();
    $stmt->close();
    
    return $userName;
}

function transferAmount($connection, $sourceCardNumber, $targetCardNumber, $amount, $sourceStatement, $targetStatement, &$response) {
    $amount = floatval($amount); 

    $connection->begin_transaction();

    try {
        // Levonás a forrás kártyáról
        $withdrawStmt = $connection->prepare("UPDATE card SET balance = balance - ? WHERE cardnumber = ?");
        $withdrawStmt->bind_param("ds", $amount, $sourceCardNumber);
        if (!$withdrawStmt->execute()) {
            throw new Exception("Withdraw statement execution failed.");
        }
        $withdrawStmt->close();

        // Jóváírás a cél kártyára
        $depositStmt = $connection->prepare("UPDATE card SET balance = balance + ? WHERE cardnumber = ?");
        $depositStmt->bind_param("ds", $amount, $targetCardNumber);
        if (!$depositStmt->execute()) {
            throw new Exception("Deposit statement execution failed.");
        }
        $depositStmt->close();

        // Tranzakció rögzítése a forrás kártyához
        $sourceTransactionStmt = $connection->prepare("INSERT INTO transaction (cardnumber, amount, statement, date) VALUES (?, ?, ?, NOW())");
        $sourceAmount = -$amount; // Negatív összeg
        $sourceTransactionStmt->bind_param("sds", $sourceCardNumber, $sourceAmount, $sourceStatement);
        $sourceTransactionStmt->execute();
        $sourceTransactionStmt->close();

        // Tranzakció rögzítése a cél kártyához
        $targetTransactionStmt = $connection->prepare("INSERT INTO transaction (cardnumber, amount, statement, date) VALUES (?, ?, ?, NOW())");
        $targetTransactionStmt->bind_param("sds", $targetCardNumber, $amount, $targetStatement);
        $targetTransactionStmt->execute();
        $targetTransactionStmt->close();

        $connection->commit();

        $response['success'] = true;
        $response['redirect'] = 'randomQuote.php';

    } catch (Exception $e) {
        $connection->rollback();
        $response['success'] = false;
        $response['errors']['general'] = 'A server error occurred. Please try again later.';
        error_log("Transfer error: " . $e->getMessage());
    }
}