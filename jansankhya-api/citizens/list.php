<?php
require '../config/db.php';

$state = $_GET['state'] ?? 'All';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10000;

if ($state !== 'All' && $state !== '') {
  $stmt = $pdo->prepare("SELECT * FROM citizens WHERE state = ? ORDER BY created_at DESC LIMIT " . $limit);
  $stmt->execute([$state]);
} else {
  $stmt = $pdo->prepare("SELECT * FROM citizens ORDER BY created_at DESC LIMIT " . $limit);
  $stmt->execute([]);
}

$rows = $stmt->fetchAll();

$citizens = array_map(fn($r) => [
  'uid'               => $r['uid'],
  'name'              => $r['name'],
  'firstName'         => $r['first_name']          ?? '',
  'lastName'          => $r['last_name']            ?? '',
  'gender'            => $r['gender']               ?? '',
  'dob'               => $r['dob']                  ?? '',
  'age'               => (int)$r['age'],
  'religion'          => $r['religion']             ?? '',
  'caste'             => $r['caste']                ?? '',
  'motherTongue'      => $r['mother_tongue']        ?? '',
  'maritalStatus'     => $r['marital_status']       ?? '',
  'mobile'            => $r['mobile']               ?? '',
  'email'             => $r['email']                ?? '',
  'aadhaar'           => $r['aadhaar']              ?? '',
  'state'             => $r['state']                ?? '',
  'district'          => $r['district']             ?? '',
  'pincode'           => $r['pincode']              ?? '',
  'education'         => $r['education']            ?? '',
  'occupation'        => $r['occupation']           ?? '',
  'disability'        => $r['disability']           ?? '',
  'houseMaterial'     => $r['house_material']       ?? '',
  'homeOwnership'     => $r['home_ownership']       ?? '',
  'drinkingWater'     => $r['drinking_water']       ?? '',
  'electricitySource' => $r['electricity_source']   ?? '',
  'cookingFuel'       => $r['cooking_fuel']         ?? '',
  'sanitation'        => $r['sanitation']           ?? '',
  'householdSize'     => (int)$r['household_size'],
  'numberOfChildren'  => (int)$r['number_of_children'],
  'incomeClass'       => $r['income_class']         ?? '',
  'migrationReason'   => $r['migration_reason']     ?? '',
  'supervisorId'      => $r['supervisor_id']        ?? '',
  'registeredOn'      => $r['registered_on']        ?? '',
  'qrCode'            => '',
], $rows);

echo json_encode(['success' => true, 'citizens' => $citizens, 'total' => count($citizens)]);
?>