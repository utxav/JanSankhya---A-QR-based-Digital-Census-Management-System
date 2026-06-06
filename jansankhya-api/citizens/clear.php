<?php
require '../config/db.php';

$pdo->exec("DELETE FROM citizens");
echo json_encode(['success' => true]);
?>