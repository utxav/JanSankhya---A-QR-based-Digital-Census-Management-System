<?php
require '../config/db.php';

$stmt = $pdo->query("SELECT * FROM enumerators ORDER BY created_at ASC");
$rows = $stmt->fetchAll();

$enumerators = array_map(fn($r) => [
  'id'           => $r['id'],
  'name'         => $r['name'],
  'phone'        => $r['phone'],
  'state'        => $r['state'],
  'district'     => $r['district'],
  'supervisorId' => $r['supervisor_id'] ?? '',
  'password'     => $r['password'],
  'assigned'     => (int)$r['assigned'],
  'completed'    => (int)$r['completed'],
  'pending'      => (int)$r['pending'],
  'createdAt'    => $r['created_at'],
], $rows);

echo json_encode(['success' => true, 'enumerators' => $enumerators]);
?>