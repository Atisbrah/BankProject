<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'transactions' => [],
    'errors' => []
];

if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) {
    $cardNumber = isset($_GET['cardnumber']) ? $_GET['cardnumber'] : '';

    if (!empty($cardNumber)) {
        $query = "SELECT id, cardnumber, amount, statement, date FROM transaction WHERE cardnumber = ?";
        
        $stmt = $connection->prepare($query);
        $stmt->bind_param('s', $cardNumber); // Assuming cardnumber is a string
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $response['transactions'][] = $row;
            }
            $response['success'] = true;
        } else {
            $response['errors'][] = 'No transactions found for this card.';
        }
        $stmt->close();
    } else {
        $response['errors'][] = 'Invalid card number.';
    }
} else {
    $response['errors'][] = 'Unauthorized access.';
}

echo json_encode($response);
$connection->close();
