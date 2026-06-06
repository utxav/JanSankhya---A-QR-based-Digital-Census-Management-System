<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['uid'])) {
    echo json_encode(["success" => false, "message" => "UID is required"]);
    exit;
}

$sql = "INSERT INTO census_records (
    uid, enumerator_id,
    education, field_of_study, blood_group, disability,
    employment_status, occupation, monthly_income, income_category,
    house_type, ownership, toilet_type, drinking_water, electricity, cooking_fuel, num_rooms, internet,
    total_people, total_males, total_females, total_children, senior_citizens, earning_members, family_type,
    health_insurance, covid_vaccination, physical_activity, nearest_healthcare, chronic_diseases,
    migration_status, state_of_origin, migration_reason, migration_year,
    ration_card, bank_account, govt_schemes,
    latitude, longitude,
    created_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['uid'] ?? '',
        $data['enumerator_id'] ?? '',
        $data['education'] ?? '',
        $data['field_of_study'] ?? '',
        $data['blood_group'] ?? '',
        $data['disability'] ?? '',
        $data['employment_status'] ?? '',
        $data['occupation'] ?? '',
        !empty($data['monthly_income']) ? (int)$data['monthly_income'] : 0,
        $data['income_category'] ?? '',
        $data['house_type'] ?? '',
        $data['ownership'] ?? '',
        $data['toilet_type'] ?? '',
        $data['drinking_water'] ?? '',
        $data['electricity'] ?? '',
        $data['cooking_fuel'] ?? '',
        !empty($data['num_rooms']) ? (int)$data['num_rooms'] : 0,
        $data['internet'] ?? '',
        !empty($data['total_people']) ? (int)$data['total_people'] : 0,
        !empty($data['total_males']) ? (int)$data['total_males'] : 0,
        !empty($data['total_females']) ? (int)$data['total_females'] : 0,
        !empty($data['total_children']) ? (int)$data['total_children'] : 0,
        !empty($data['senior_citizens']) ? (int)$data['senior_citizens'] : 0,
        !empty($data['earning_members']) ? (int)$data['earning_members'] : 0,
        $data['family_type'] ?? '',
        $data['health_insurance'] ?? '',
        $data['covid_vaccination'] ?? '',
        $data['physical_activity'] ?? '',
        $data['nearest_healthcare'] ?? '',
        $data['chronic_diseases'] ?? '',
        $data['migration_status'] ?? '',
        $data['state_of_origin'] ?? '',
        $data['migration_reason'] ?? '',
        !empty($data['migration_year']) ? (int)$data['migration_year'] : 0,
        $data['ration_card'] ?? '',
        $data['bank_account'] ?? '',
        $data['govt_schemes'] ?? '',
        !empty($data['latitude']) ? (float)$data['latitude'] : null,
        !empty($data['longitude']) ? (float)$data['longitude'] : null,
    ]);
    echo json_encode(["success" => true, "message" => "Record submitted successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>