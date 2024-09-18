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

try {
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        // Lekérdezzük az aktuális (Primary) bankkártyát
        $cardQuery = "SELECT cardnumber FROM card WHERE user_id = ? AND priority = 1";
        $stmt = $connection->prepare($cardQuery);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $cardResult = $stmt->get_result();

        if ($cardResult->num_rows > 0) {
            $card = $cardResult->fetch_assoc();
            $cardNumber = $card['cardnumber'];

            // Lekérdezzük a tranzakciókat az aktuális bankkártyához
            $transactionQuery = "SELECT id, amount, statement, date FROM transaction WHERE cardnumber = ?";
            $stmt = $connection->prepare($transactionQuery);
            $stmt->bind_param("s", $cardNumber);
            $stmt->execute();
            $transactionResult = $stmt->get_result();

            // Ha vannak tranzakciók
            if ($transactionResult->num_rows > 0) {
                while ($row = $transactionResult->fetch_assoc()) {
                    $response['transaction'][] = $row;
                }
                $response['success'] = true;
            } else {
                $response['errors'][] = 'No transaction found for this card.';
            }
        } else {
            $response['errors'][] = 'No primary card found for this user.';
        }

        $stmt->close();
    } else {
        $response['errors'][] = 'User not logged in.';
    }

    echo json_encode($response);
} catch (Exception $e) {
    $response['errors'][] = 'An unexpected error occurred: ' . $e->getMessage();
    echo json_encode($response);
}

$connection->close();
?>
