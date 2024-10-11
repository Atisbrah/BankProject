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

if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) {

    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

    if ($userId === 0) {
        $response['errors'][] = 'Invalid user ID.';
        echo json_encode($response);
        exit;
    }

    if ($userId > 0) {
        $_SESSION['selected_user_id'] = $userId;

        $query = "SELECT id, cardnumber, user_id, balance, status, priority FROM card WHERE user_id = ?";
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

echo json_encode($response);
$connection->close();
