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

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve és admin jogosultsággal rendelkezik
if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) {
    // Ellenőrizzük a user_id GET paramétert
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

    if ($userId === 0) {
        $response['errors'][] = 'Invalid user ID.';
        echo json_encode($response);
        exit;
    }

    if ($userId > 0) {
        $_SESSION['selected_user_id'] = $userId;

        // SQL lekérdezés a kártyák lekérésére
        $query = "SELECT cardnumber, balance, status, priority FROM card WHERE user_id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $response['cards'][] = $row;
            }
            $response['success'] = true;
        } else {
            $response['errors'][] = 'No cards found for this user.';
        }
        $stmt->close();
    } else {
        $response['errors'][] = 'Invalid user ID.';
    }
} else {
    $response['errors'][] = 'Unauthorized access.';
}

// Kérés naplózása
error_log('Request User ID: ' . $userId);

// Válasz naplózása
error_log('Response: ' . json_encode($response));

echo json_encode($response);
$connection->close();
