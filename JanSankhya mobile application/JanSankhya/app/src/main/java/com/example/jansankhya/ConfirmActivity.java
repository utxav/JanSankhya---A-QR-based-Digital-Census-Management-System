package com.example.jansankhya;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.android.volley.Request;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class ConfirmActivity extends AppCompatActivity {

    TextView tvSummary, tvStatus;
    Button btnSubmit, btnBack;
    RequestQueue requestQueue;
    Bundle data;
    FusedLocationProviderClient fusedLocationClient;
    double latitude = 0.0, longitude = 0.0;
    AppDatabase db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_confirm);

        tvSummary = findViewById(R.id.tvSummary);
        tvStatus = findViewById(R.id.tvStatus);
        btnSubmit = findViewById(R.id.btnSubmit);
        btnBack = findViewById(R.id.btnBack);

        requestQueue = Volley.newRequestQueue(this);
        requestQueue.getCache().clear();
        db = AppDatabase.getInstance(this);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        data = getIntent().getExtras();

        if (data != null) {
            String summary =
                    "UID: " + data.getString("uid") + "\n\n" +
                            "--- Personal & Education ---\n" +
                            "Education: " + data.getString("education") + "\n" +
                            "Field of Study: " + data.getString("field_of_study") + "\n" +
                            "Blood Group: " + data.getString("blood_group") + "\n" +
                            "Disability: " + data.getString("disability") + "\n\n" +
                            "--- Employment ---\n" +
                            "Employment: " + data.getString("employment_status") + "\n" +
                            "Occupation: " + data.getString("occupation") + "\n" +
                            "Income: ₹" + data.getString("monthly_income") + "\n\n" +
                            "--- Housing ---\n" +
                            "House Type: " + data.getString("house_type") + "\n" +
                            "Ownership: " + data.getString("ownership") + "\n" +
                            "Water: " + data.getString("drinking_water") + "\n" +
                            "Electricity: " + data.getString("electricity") + "\n\n" +
                            "--- Family ---\n" +
                            "Total Members: " + data.getString("total_people") + "\n" +
                            "Males: " + data.getString("total_males") + "\n" +
                            "Females: " + data.getString("total_females") + "\n" +
                            "Children: " + data.getString("total_children") + "\n" +
                            "Family Type: " + data.getString("family_type") + "\n\n" +
                            "--- Health ---\n" +
                            "Insurance: " + data.getString("health_insurance") + "\n" +
                            "Vaccination: " + data.getString("covid_vaccination") + "\n" +
                            "Diseases: " + data.getString("chronic_diseases") + "\n\n" +
                            "--- Migration ---\n" +
                            "Status: " + data.getString("migration_status") + "\n" +
                            "Reason: " + data.getString("migration_reason") + "\n\n" +
                            "--- Govt Schemes ---\n" +
                            "Ration Card: " + data.getString("ration_card") + "\n" +
                            "Bank Account: " + data.getString("bank_account") + "\n" +
                            "Schemes: " + data.getString("govt_schemes");

            tvSummary.setText(summary);
        }

        getLocation();
        syncPendingRecords();

        btnSubmit.setOnClickListener(v -> submitRecord());
        btnBack.setOnClickListener(v -> finish());

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void getLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1001);
            return;
        }
        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {
            if (location != null) {
                latitude = location.getLatitude();
                longitude = location.getLongitude();
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1001 && grantResults.length > 0
                && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            getLocation();
        }
    }

    private void submitRecord() {
        btnSubmit.setEnabled(false);
        if (NetworkHelper.isConnected(this)) {
            tvStatus.setText("Submitting online...");
            submitOnline();
        } else {
            tvStatus.setText("No internet. Saving offline...");
            saveOffline();
        }
    }

    private void submitOnline() {
        SharedPreferences prefs = getSharedPreferences("jansankhya", MODE_PRIVATE);
        String enumeratorId = prefs.getString("user_id", "");

        JSONObject params = buildParams(enumeratorId);
        if (params == null) {
            tvStatus.setText("Error preparing data.");
            btnSubmit.setEnabled(true);
            return;
        }

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.POST,
                Constants.getCensusSubmitUrl(this),
                params,
                response -> {
                    try {
                        if (response.getBoolean("success")) {
                            tvStatus.setTextColor(0xFF43A047);
                            tvStatus.setText("✓ Record submitted successfully!");
                            btnSubmit.setEnabled(false);
                            new android.os.Handler().postDelayed(() -> {
                                Intent intent = new Intent(ConfirmActivity.this, HomeActivity.class);
                                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                startActivity(intent);
                                finish();
                            }, 2000);
                        } else {
                            tvStatus.setText(response.getString("message"));
                            btnSubmit.setEnabled(true);
                        }
                    } catch (JSONException e) {
                        tvStatus.setText("Unexpected error. Try again.");
                        btnSubmit.setEnabled(true);
                    }
                },
                error -> {
                    tvStatus.setTextColor(0xFFFF9933);
                    tvStatus.setText("⚠ No connection. Saving offline...");
                    saveOffline();
                }
        ) {
            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
            }

            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("User-Agent", Constants.USER_AGENT);
                return headers;
            }

            @Override
            public com.android.volley.Cache.Entry getCacheEntry() {
                return null;
            }
        };

        request.setShouldCache(false);
        request.setRetryPolicy(new com.android.volley.DefaultRetryPolicy(
                10000, 0,
                com.android.volley.DefaultRetryPolicy.DEFAULT_BACKOFF_MULT
        ));
        requestQueue.add(request);
    }

    private void saveOffline() {
        new Thread(() -> {
            SharedPreferences prefs = getSharedPreferences("jansankhya", MODE_PRIVATE);
            String enumeratorId = prefs.getString("user_id", "");

            CensusRecord record = new CensusRecord();
            record.uid = data.getString("uid");
            record.enumeratorId = enumeratorId;
            record.education = data.getString("education");
            record.fieldOfStudy = data.getString("field_of_study");
            record.bloodGroup = data.getString("blood_group");
            record.disability = data.getString("disability");
            record.employmentStatus = data.getString("employment_status");
            record.occupation = data.getString("occupation");
            record.monthlyIncome = data.getString("monthly_income");
            record.incomeCategory = data.getString("income_category");
            record.houseType = data.getString("house_type");
            record.ownership = data.getString("ownership");
            record.toiletType = data.getString("toilet_type");
            record.drinkingWater = data.getString("drinking_water");
            record.electricity = data.getString("electricity");
            record.cookingFuel = data.getString("cooking_fuel");
            record.numRooms = data.getString("num_rooms");
            record.internet = data.getString("internet");
            record.totalPeople = data.getString("total_people");
            record.totalMales = data.getString("total_males");
            record.totalFemales = data.getString("total_females");
            record.totalChildren = data.getString("total_children");
            record.seniorCitizens = data.getString("senior_citizens");
            record.earningMembers = data.getString("earning_members");
            record.familyType = data.getString("family_type");
            record.healthInsurance = data.getString("health_insurance");
            record.covidVaccination = data.getString("covid_vaccination");
            record.physicalActivity = data.getString("physical_activity");
            record.nearestHealthcare = data.getString("nearest_healthcare");
            record.chronicDiseases = data.getString("chronic_diseases");
            record.migrationStatus = data.getString("migration_status");
            record.stateOfOrigin = data.getString("state_of_origin");
            record.migrationReason = data.getString("migration_reason");
            record.migrationYear = data.getString("migration_year");
            record.rationCard = data.getString("ration_card");
            record.bankAccount = data.getString("bank_account");
            record.govtSchemes = data.getString("govt_schemes");
            record.latitude = latitude;
            record.longitude = longitude;
            record.synced = false;

            db.censusRecordDao().insert(record);

            runOnUiThread(() -> {
                tvStatus.setTextColor(0xFFFF9933);
                tvStatus.setText("⚠ Saved offline! Will sync when internet is available.");
                btnSubmit.setEnabled(false);

                new android.os.Handler().postDelayed(() -> {
                    Intent intent = new Intent(ConfirmActivity.this, HomeActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    finish();
                }, 2000);
            });
        }).start();
    }

    private void syncPendingRecords() {
        if (!NetworkHelper.isConnected(this)) return;

        new Thread(() -> {
            java.util.List<CensusRecord> unsynced = db.censusRecordDao().getUnsynced();
            for (CensusRecord record : unsynced) {
                JSONObject params = buildParamsFromRecord(record);
                if (params == null) continue;

                JsonObjectRequest request = new JsonObjectRequest(
                        Request.Method.POST,
                        Constants.getCensusSubmitUrl(this),
                        params,
                        response -> {
                            try {
                                if (response.getBoolean("success")) {
                                    db.censusRecordDao().markSynced(record.id);
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        },
                        error -> {}
                ) {
                    @Override
                    public String getBodyContentType() {
                        return "application/json; charset=utf-8";
                    }

                    @Override
                    public Map<String, String> getHeaders() {
                        Map<String, String> headers = new HashMap<>();
                        headers.put("User-Agent", Constants.USER_AGENT);
                        return headers;
                    }
                };
                request.setShouldCache(false);
                requestQueue.add(request);
            }
        }).start();
    }

    private JSONObject buildParams(String enumeratorId) {
        JSONObject params = new JSONObject();
        try {
            params.put("uid", data.getString("uid"));
            params.put("enumerator_id", enumeratorId);
            params.put("education", data.getString("education"));
            params.put("field_of_study", data.getString("field_of_study"));
            params.put("blood_group", data.getString("blood_group"));
            params.put("disability", data.getString("disability"));
            params.put("employment_status", data.getString("employment_status"));
            params.put("occupation", data.getString("occupation"));
            params.put("monthly_income", data.getString("monthly_income"));
            params.put("income_category", data.getString("income_category"));
            params.put("house_type", data.getString("house_type"));
            params.put("ownership", data.getString("ownership"));
            params.put("toilet_type", data.getString("toilet_type"));
            params.put("drinking_water", data.getString("drinking_water"));
            params.put("electricity", data.getString("electricity"));
            params.put("cooking_fuel", data.getString("cooking_fuel"));
            params.put("num_rooms", data.getString("num_rooms"));
            params.put("internet", data.getString("internet"));
            params.put("total_people", data.getString("total_people"));
            params.put("total_males", data.getString("total_males"));
            params.put("total_females", data.getString("total_females"));
            params.put("total_children", data.getString("total_children"));
            params.put("senior_citizens", data.getString("senior_citizens"));
            params.put("earning_members", data.getString("earning_members"));
            params.put("family_type", data.getString("family_type"));
            params.put("health_insurance", data.getString("health_insurance"));
            params.put("covid_vaccination", data.getString("covid_vaccination"));
            params.put("physical_activity", data.getString("physical_activity"));
            params.put("nearest_healthcare", data.getString("nearest_healthcare"));
            params.put("chronic_diseases", data.getString("chronic_diseases"));
            params.put("migration_status", data.getString("migration_status"));
            params.put("state_of_origin", data.getString("state_of_origin"));
            params.put("migration_reason", data.getString("migration_reason"));
            params.put("migration_year", data.getString("migration_year"));
            params.put("ration_card", data.getString("ration_card"));
            params.put("bank_account", data.getString("bank_account"));
            params.put("govt_schemes", data.getString("govt_schemes"));
            params.put("latitude", latitude);
            params.put("longitude", longitude);
            return params;
        } catch (JSONException e) {
            return null;
        }
    }

    private JSONObject buildParamsFromRecord(CensusRecord r) {
        JSONObject params = new JSONObject();
        try {
            params.put("uid", r.uid);
            params.put("enumerator_id", r.enumeratorId);
            params.put("education", r.education);
            params.put("field_of_study", r.fieldOfStudy);
            params.put("blood_group", r.bloodGroup);
            params.put("disability", r.disability);
            params.put("employment_status", r.employmentStatus);
            params.put("occupation", r.occupation);
            params.put("monthly_income", r.monthlyIncome);
            params.put("income_category", r.incomeCategory);
            params.put("house_type", r.houseType);
            params.put("ownership", r.ownership);
            params.put("toilet_type", r.toiletType);
            params.put("drinking_water", r.drinkingWater);
            params.put("electricity", r.electricity);
            params.put("cooking_fuel", r.cookingFuel);
            params.put("num_rooms", r.numRooms);
            params.put("internet", r.internet);
            params.put("total_people", r.totalPeople);
            params.put("total_males", r.totalMales);
            params.put("total_females", r.totalFemales);
            params.put("total_children", r.totalChildren);
            params.put("senior_citizens", r.seniorCitizens);
            params.put("earning_members", r.earningMembers);
            params.put("family_type", r.familyType);
            params.put("health_insurance", r.healthInsurance);
            params.put("covid_vaccination", r.covidVaccination);
            params.put("physical_activity", r.physicalActivity);
            params.put("nearest_healthcare", r.nearestHealthcare);
            params.put("chronic_diseases", r.chronicDiseases);
            params.put("migration_status", r.migrationStatus);
            params.put("state_of_origin", r.stateOfOrigin);
            params.put("migration_reason", r.migrationReason);
            params.put("migration_year", r.migrationYear);
            params.put("ration_card", r.rationCard);
            params.put("bank_account", r.bankAccount);
            params.put("govt_schemes", r.govtSchemes);
            params.put("latitude", r.latitude);
            params.put("longitude", r.longitude);
            return params;
        } catch (JSONException e) {
            return null;
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}