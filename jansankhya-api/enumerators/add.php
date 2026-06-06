<?php
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['state']) || empty($data['password'])) {
  echo json_encode(['success' => false, 'error' => 'Missing required fields']);
  exit();
}

$stmt = $pdo->query("SELECT id FROM enumerators ORDER BY id DESC LIMIT 1");
$last = $stmt->fetch();
$num  = $last ? intval(substr($last['id'], 3)) + 1 : 1;
$id   = 'ENM' . str_pad($num, 5, '0', STR_PAD_LEFT);

$stmt = $pdo->prepare(
  "INSERT INTO enumerators
     (id, name, phone, state, district, supervisor_id, password, assigned, completed, pending, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)"
);
$stmt->execute([
  $id,
  $data['name'],
  $data['phone']        ?? '',
  $data['state'],
  $data['district']     ?? '',
  $data['supervisorId'] ?? null,
  $data['password'],
  date('Y-m-d'),
]);

echo json_encode(['success' => true, 'id' => $id, 'password' => $data['password']]);
?>