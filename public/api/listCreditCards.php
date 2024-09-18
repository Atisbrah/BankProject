<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'cards' => [],
    'errors' => []
];

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    // Lekérdezzük az aktuális felhasználóhoz tartozó összes bankkártyát
    $query = "SELECT cardnumber, balance, status, priority FROM card WHERE user_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Ha vannak találatok
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response['cards'][] = $row; // Hozzáadjuk a kártyákat a válaszhoz
        }
        $response['success'] = true;
    } else {
        $response['errors'][] = 'No credit cards found for this user.';
    }

    $stmt->close();
} else {
    $response['errors'][] = 'User not logged in.';
}

echo json_encode($response);
$connection->close();
?>