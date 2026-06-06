<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
  echo json_encode(['success' => false, 'error' => 'ID required']);
  exit();
}

if ($data['id'] === 'EMP00001') {
  echo json_encode(['success' => false, 'error' => 'Cannot delete the main admin']);
  exit();
}

$stmt = $pdo->prepare("DELETE FROM staff WHERE id = ?");
$stmt->execute([$data['id']]);
echo json_encode(['success' => true]);
?>