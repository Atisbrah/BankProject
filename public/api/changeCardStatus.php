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

        if (empty($cardNumber) || !preg_match('/^\d{4}-\d{4}-\d{4}-\d{4}$/', $cardNumber)) {
            throw new Exception('Invalid card number format.');
        }

        $userId = $_SESSION['user_id'];

        $checkQuery = "SELECT status FROM card WHERE cardnumber = ? AND user_id = ?";
        $stmt = $connection->prepare($checkQuery);
        $stmt->bind_param("si", $cardNumber, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception('Card not found.');
        }

        $row = $result->fetch_assoc();
        
        $setCardNumberQuery = "SET @cardnumber = ?";
        $stmt = $connection->prepare($setCardNumberQuery);
        $stmt->bind_param("s", $cardNumber);
        $stmt->execute();

        $updateQuery = "
            UPDATE card
            SET status = CASE
                WHEN status = 0 THEN 1
                WHEN status = 1 THEN 2
                ELSE status
            END
            WHERE CONVERT(cardnumber USING utf8mb4) = CONVERT(@cardnumber USING utf8mb4)";

        if ($connection->query($updateQuery)) {
            $response['success'] = true;
        } else {
            throw new Exception('Failed to update card status.');
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
