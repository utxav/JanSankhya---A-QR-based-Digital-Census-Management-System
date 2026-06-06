<?php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['uid'])) {
    echo json_encode(['success' => false, 'message' => 'UID is required']);
    exit();
}

// Duplicate check
$check = $pdo->prepare("SELECT id FROM census_records WHERE uid = ?");
$check->execute([$data['uid']]);
if ($check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Census already recorded for this UID', 'duplicate' => true]);
    exit();
}

$stmt = $pdo->prepare("
    INSERT INTO census_records (
        uid, enumerator_id, education, field_of_study, blood_group, disability,
        employment_status, occupation, monthly_income, income_category,
        house_type, ownership, toilet_type, drinking_water, electricity,
        cooking_fuel, num_rooms, internet, total_people, total_males,
        total_females, total_children, senior_citizens, earning_members,
        family_type, health_insurance, covid_vaccination, physical_activity,
        nearest_healthcare, chronic_diseases, migration_status, state_of_origin,
        migration_reason, migration_year, ration_card, bank_account,
        govt_schemes, latitude, longitude
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
");

$stmt->execute([
    $data['uid'], $data['enumerator_id'] ?? '',
    $data['education'] ?? '', $data['field_of_study'] ?? '',
    $data['blood_group'] ?? '', $data['disability'] ?? '',
    $data['employment_status'] ?? '', $data['occupation'] ?? '',
    $data['monthly_income'] ?? '', $data['income_category'] ?? '',
    $data['house_type'] ?? '', $data['ownership'] ?? '',
    $data['toilet_type'] ?? '', $data['drinking_water'] ?? '',
    $data['electricity'] ?? '', $data['cooking_fuel'] ?? '',
    $data['num_rooms'] ?? '', $data['internet'] ?? '',
    $data['total_people'] ?? '', $data['total_males'] ?? '',
    $data['total_females'] ?? '', $data['total_children'] ?? '',
    $data['senior_citizens'] ?? '', $data['earning_members'] ?? '',
    $data['family_type'] ?? '', $data['health_insurance'] ?? '',
    $data['covid_vaccination'] ?? '', $data['physical_activity'] ?? '',
    $data['nearest_healthcare'] ?? '', $data['chronic_diseases'] ?? '',
    $data['migration_status'] ?? '', $data['state_of_origin'] ?? '',
    $data['migration_reason'] ?? '', $data['migration_year'] ?? '',
    $data['ration_card'] ?? '', $data['bank_account'] ?? '',
    $data['govt_schemes'] ?? '',
    $data['latitude'] ?? 0, $data['longitude'] ?? 0,
]);

echo json_encode(['success' => true, 'message' => 'Census record saved successfully']);
?>