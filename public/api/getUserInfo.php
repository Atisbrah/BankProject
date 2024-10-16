<?php
session_start();
require_once "../../config/db.php";

header('Content-Type: application/json');

$response = [
    'user_name' => null,
    'priority_card' => null,
    'authority' => null 
];

if (isset($_SESSION['user_name']) && isset($_SESSION['user_id'])) {
    $response['user_name'] = $_SESSION['user_name'];
    
    $userId = $_SESSION['user_id'];
    $query = "SELECT cardnumber, balance, status FROM card WHERE user_id = ? AND priority = 1 LIMIT 1";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['priority_card'] = $result->fetch_assoc(); 
    }

    $query = "SELECT authority FROM user WHERE id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['authority'] = $result->fetch_assoc()['authority'];
    }

    $query = "SELECT COUNT(*) as card_count FROM card WHERE user_id = ? AND priority = 1";  
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $response['priority_card_count'] = $result->fetch_assoc()['card_count'];
    }

    $stmt->close();
}

echo json_encode($response);
$connection->close();
?>
