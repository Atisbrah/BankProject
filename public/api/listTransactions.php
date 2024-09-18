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

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    // Lekérdezzük az aktuális (Primary = 1) bankkártyát
    $query = "SELECT cardnumber FROM card WHERE user_id = ? AND priority = 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($primaryCardNumber);
    $stmt->fetch();
    $stmt->close();

    if ($primaryCardNumber) {
        // Lekérdezzük az aktuális (Primary = 1) bankkártya tranzakcióit
        $transactionQuery = "SELECT amount, statement, date FROM transaction WHERE cardnumber = ?";
        $transactionStmt = $connection->prepare($transactionQuery);
        $transactionStmt->bind_param("s", $primaryCardNumber);
        $transactionStmt->execute();
        $result = $transactionStmt->get_result();

        // Ha vannak tranzakciók
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $response['transactions'][] = $row; // Hozzáadjuk a tranzakciókat a válaszhoz
            }
            $response['success'] = true;
        } else {
            $response['errors'][] = 'No transactions found for the primary card.';
        }

        $transactionStmt->close();
    } else {
        $response['errors'][] = 'No primary card found for this user.';
    }
} else {
    $response['errors'][] = 'User not logged in.';
}

echo json_encode($response);
$connection->close();
?>
