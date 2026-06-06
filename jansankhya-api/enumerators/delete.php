<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
  echo json_encode(['success' => false, 'error' => 'ID required']);
  exit();
}

$stmt = $pdo->prepare("DELETE FROM enumerators WHERE id = ?");
$stmt->execute([$data['id']]);
echo json_encode(['success' => true]);
?>