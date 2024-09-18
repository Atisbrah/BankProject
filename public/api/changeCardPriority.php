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

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $cardNumber = trim($data['cardNumber']);

        // Validate inputs
        if (empty($cardNumber) || !preg_match('/^\d{4}-\d{4}-\d{4}-\d{4}$/', $cardNumber)) {
            throw new Exception('Invalid card number format.');
        }

        $userId = $_SESSION['user_id'];

        // Set all other cards to Secondary (priority = 0)
        $resetPriorityQuery = "UPDATE card SET priority = 0 WHERE user_id = ?";
        $stmt = $connection->prepare($resetPriorityQuery);
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        // Set the selected card to Primary (priority = 1)
        $updatePriorityQuery = "UPDATE card SET priority = 1 WHERE cardnumber = ? AND user_id = ?";
        $stmt = $connection->prepare($updatePriorityQuery);
        $stmt->bind_param("si", $cardNumber, $userId);

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            throw new Exception('Failed to update card priority.');
        }
    } else {
        throw new Exception('Invalid request method.');
    }
} catch (Exception $e) {
    $response['errors'][] = $e->getMessage();
}

echo json_encode($response);
$connection->close();
?>
