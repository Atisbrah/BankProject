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

$data = json_decode(file_get_contents('php://input'), true);
$cardId = $data['cardId'];

if (isset($_SESSION['user_id']) && $_SESSION['user_authority'] == 2) { 
    try {
        $stmt = $pdo->prepare("UPDATE card SET priority = 0 WHERE priority = 1 AND id != :cardId");
        $stmt->execute(['cardId' => $cardId]);
    
        $stmt = $pdo->prepare("UPDATE card SET priority = 1 WHERE id = :cardId");
        $stmt->execute(['cardId' => $cardId]);
    
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'errors' => [$e->getMessage()]]);
    }
} else {
    $response['errors'][] = 'Unauthorized access.';
}