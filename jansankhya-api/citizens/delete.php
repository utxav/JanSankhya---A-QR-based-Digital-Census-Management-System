<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['uid'])) {
  echo json_encode(['success' => false, 'error' => 'UID required']);
  exit();
}

$stmt = $pdo->prepare("DELETE FROM citizens WHERE uid = ?");
$stmt->execute([$data['uid']]);
echo json_encode(['success' => true]);
?>