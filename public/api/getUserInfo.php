<?php
session_start(); // Indítsa el a session-t
require_once "../../config/db.php"; // Adatbázis kapcsolat

header('Content-Type: application/json');

$response = [
    'user_name' => null,
    'priority_card' => null
];

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (isset($_SESSION['user_name']) && isset($_SESSION['user_id'])) {
    $response['user_name'] = $_SESSION['user_name'];
    
    // Lekérjük az adott felhasználóhoz tartozó, legmagasabb prioritású bankkártyát
    $userId = $_SESSION['user_id'];
    $query = "SELECT cardnumber, balance, status FROM card WHERE user_id = ? AND priority = 1 LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['priority_card'] = $result->fetch_assoc(); // Lekért kártya adatok hozzáadása a válaszhoz
    }

    $stmt->close();
}

echo json_encode($response);
$connection->close();
?>
