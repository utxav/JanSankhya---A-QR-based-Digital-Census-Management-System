<?php
$allowed = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed)) {
  header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$host = '127.0.0.1';  // use IP not localhost — avoids socket issues with MySQL Community
$port = '3306';
$db   = 'jansankhya';
$user = 'root';
$pass = 'Utsav@222';  // ← put your MySQL Community root password here if you have one

try {
  $pdo = new PDO(
    "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
    $user,
    $pass,
    [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'DB error: ' . $e->getMessage()]);
  exit();
}
?>