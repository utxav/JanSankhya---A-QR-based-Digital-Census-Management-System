<?php
require_once '../config/db.php';

$stmt = $pdo->prepare("SELECT * FROM census_records ORDER BY created_at DESC");
$stmt->execute();
$records = $stmt->fetchAll();

echo json_encode(["success" => true, "records" => $records]);
?>