<?php
require_once '../config/db.php';

$citizens = $pdo->query("SELECT COUNT(*) FROM citizens")->fetchColumn();
$records = $pdo->query("SELECT COUNT(*) FROM census_records")->fetchColumn();
$states = $pdo->query("SELECT COUNT(DISTINCT state) FROM citizens")->fetchColumn();

echo json_encode([
    "success" => true,
    "citizens" => $citizens,
    "census_records" => $records,
    "states" => $states
]);
?>