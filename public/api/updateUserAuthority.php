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
    $userId = $data['userId'];
    $newAuthority = $data['authority'];

    if (!is_numeric($newAuthority) || $newAuthority < 0 || $newAuthority > 2) {
        $response['errors'][] = 'Invalid authority value.';
    } else {
        $query = "UPDATE user SET authority = ? WHERE id = ?";
        $stmt = $connection->prepare($query);
        $stmt->bind_param('ii', $newAuthority, $userId);
        
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['errors'][] = 'Failed to update authority.';
        }
        $stmt->close();
    }
} else {
    $response['errors'][] = 'Unauthorized access.';
}

echo json_encode($response);
$connection->close();
