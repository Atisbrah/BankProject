<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'users' => [],
    'errors' => []
];

if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) {

    $query = "SELECT id, name, email, authority FROM user";

    $stmt = $connection->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response['users'][] = $row;
        }
        $response['success'] = true;
    } else {
        $response['errors'][] = 'No users found.';
    }

    $stmt->close();
} else {
    $response['errors'][] = 'Unauthorized access.';
}

echo json_encode($response);
$connection->close();
