<?php
require '../config/db.php';

$stmt = $pdo->query("SELECT * FROM staff ORDER BY created_at ASC");
$rows = $stmt->fetchAll();

$staff = array_map(fn($r) => [
  'id'        => $r['id'],
  'name'      => $r['name'],
  'role'      => $r['role'],
  'area'      => $r['area']  ?? '',
  'state'     => $r['state'] ?? '',
  'phone'     => $r['phone'] ?? '',
  'password'  => $r['password'],
  'createdAt' => $r['created_at'],
], $rows);

echo json_encode(['success' => true, 'staff' => $staff]);
?>