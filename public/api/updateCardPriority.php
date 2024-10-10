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
    
    $data = json_decode(file_get_contents("php://input"), true);
    $cardId = $data['cardId'];
    $newPriority = $data['priority'];

    if(!is_numeric($newPriority) || $newPriority < 0 || $newPriority > 1) {
        $response['errors'][] = 'Invalid priority value.';
    } else {
        $query = "UPDATE card SET priority = ? WHERE id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param('ii', $newPriority, $cardId);
        
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['errors'][] = 'Failed to update card priority.';
        }
    }

} else {
    $response['errors'][] = 'Unauthorized access.';
}

echo json_encode($response);
$connection->close();


