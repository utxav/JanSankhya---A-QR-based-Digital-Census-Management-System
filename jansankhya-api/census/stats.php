<?php
require_once '../config/db.php';

$enumeratorId = $_GET['enumerator_id'] ?? '';

$today = $pdo->prepare("SELECT COUNT(*) FROM census_records WHERE enumerator_id = ? AND DATE(created_at) = CURDATE()");
$today->execute([$enumeratorId]);

$total = $pdo->prepare("SELECT COUNT(*) FROM census_records WHERE enumerator_id = ?");
$total->execute([$enumeratorId]);

echo json_encode([
    "success" => true,
    "today" => (int)$today->fetchColumn(),
    "total" => (int)$total->fetchColumn()
]);
?>