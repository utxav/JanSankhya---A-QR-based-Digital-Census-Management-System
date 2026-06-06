<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['role']) || empty($data['password'])) {
  echo json_encode(['success' => false, 'error' => 'Missing required fields']);
  exit();
}

// Generate next SUP ID
$stmt = $pdo->query("SELECT id FROM staff WHERE role = 'supervisor' ORDER BY id DESC LIMIT 1");
$last = $stmt->fetch();
$num  = $last ? intval(substr($last['id'], 3)) + 1 : 1;
$id   = 'SUP' . str_pad($num, 5, '0', STR_PAD_LEFT);

$stmt = $pdo->prepare(
  "INSERT INTO staff (id, name, role, area, state, phone, password, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([
  $id,
  $data['name'],
  $data['role'],
  $data['area']     ?? '',
  $data['state']    ?? '',
  $data['phone']    ?? '',
  $data['password'],
  date('Y-m-d'),
]);

echo json_encode(['success' => true, 'id' => $id, 'password' => $data['password']]);
?>