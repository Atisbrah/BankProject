<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'errors' => []
];

if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) {

    $data = json_decode(file_get_contents('php://input'), true);
    $cardId = $data['cardId'];
    $newStatus = $data['status'];

    if (!is_numeric($newStatus) || $newStatus < 0 || $newStatus > 2) {
        $response['errors'][] = 'Invalid status value.';
    } else {
        $query = "UPDATE card SET status = ? WHERE id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param('ii', $newStatus, $cardId);
        
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['errors'][] = 'Failed to update card status.';
        }
        $stmt->close();
    }
} else {
    $response['errors'][] = 'Unauthorized access.';
}

echo json_encode($response);
$connection->close();


