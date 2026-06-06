<?php
require_once '../config/db.php';

$uid = $_GET['uid'] ?? '';

if (empty($uid)) {
    echo json_encode(["success" => false, "message" => "UID is required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM citizens WHERE uid = ?");
$stmt->execute([$uid]);
$citizen = $stmt->fetch();

if (!$citizen) {
    echo json_encode(["success" => false, "message" => "Citizen not found with this UID"]);
    exit;
}

// Check for duplicate
$dupStmt = $pdo->prepare("SELECT COUNT(*) FROM census_records WHERE uid = ?");
$dupStmt->execute([$uid]);
$count = (int)$dupStmt->fetchColumn();

if ($count > 0) {
    echo json_encode([
        "success" => false,
        "duplicate" => true,
        "message" => "This citizen has already been surveyed. Duplicate entry not allowed."
    ]);
    exit;
}

echo json_encode(["success" => true, "citizen" => $citizen]);
?>