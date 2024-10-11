<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../../config/db.php";
require_once "../../config/session.php";

header('Content-Type: application/json');

$response = [
    'success' => false,
    'user' => [],
    'errors' => []
];

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    $query = "SELECT id, name, email, authority FROM user WHERE id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['user'] = $result->fetch_assoc();
        $response['success'] = true;
    } else {
        $response['errors'][] = 'User not found.';
    }

    $stmt->close();
} else {
    $response['errors'][] = 'User not logged in.';
}

echo json_encode($response);
$connection->close();
?>
