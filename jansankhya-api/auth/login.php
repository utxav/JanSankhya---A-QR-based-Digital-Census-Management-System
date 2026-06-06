<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id']) || empty($data['password'])) {
  echo json_encode(['success' => false, 'message' => 'ID and password required']);
  exit();
}

// Check staff table first
$stmt = $pdo->prepare("SELECT * FROM staff WHERE id = ? AND password = ?");
$stmt->execute([$data['id'], $data['password']]);
$user = $stmt->fetch();

// If not found in staff, check enumerators table
if (!$user) {
  $stmt = $pdo->prepare("SELECT * FROM enumerators WHERE id = ? AND password = ?");
  $stmt->execute([$data['id'], $data['password']]);
  $user = $stmt->fetch();
}

if ($user) {
  echo json_encode([
    'success' => true,
    'user' => [
      'id'   => $user['id'],
      'name' => $user['name'],
      'role' => $user['role'] ?? 'enumerator',
    ]
  ]);
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid ID or password']);
}
?>