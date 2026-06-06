<?php
require_once '../config/db.php';

$stmt = $pdo->query("SELECT * FROM census_records ORDER BY created_at DESC");
$records = $stmt->fetchAll();

echo json_encode(['success' => true, 'records' => $records]);
?>