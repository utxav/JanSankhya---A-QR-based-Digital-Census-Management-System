package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;

public class HealthInfoActivity extends AppCompatActivity {

    Spinner spinnerInsurance, spinnerVaccination, spinnerActivity, spinnerHealthcare;
    Button btnNext;
    String[] diseaseOptions = {"Diabetes","Hypertension","Heart Disease","Cancer","Tuberculosis","Asthma","None"};
    ArrayList<CheckBox> diseaseCheckBoxes = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_health_info);

        spinnerInsurance = findViewById(R.id.spinnerInsurance);
        spinnerVaccination = findViewById(R.id.spinnerVaccination);
        spinnerActivity = findViewById(R.id.spinnerActivity);
        spinnerHealthcare = findViewById(R.id.spinnerHealthcare);
        btnNext = findViewById(R.id.btnNext);
        LinearLayout diseaseLayout = findViewById(R.id.diseaseLayout);

        setupSpinner(spinnerInsurance, new String[]{"Government Scheme","Private","Employer","None"});
        setupSpinner(spinnerVaccination, new String[]{"Yes - Both Doses","Yes - One Dose","Booster Taken","No"});
        setupSpinner(spinnerActivity, new String[]{"Sedentary","Light","Moderate","Active","Very Active"});
        setupSpinner(spinnerHealthcare, new String[]{"Government Hospital","Private Hospital","PHC","CHC","ASHA Centre","None Nearby"});

        for (String disease : diseaseOptions) {
            CheckBox cb = new CheckBox(this);
            cb.setText(disease);
            cb.setTextSize(14);
            cb.setPadding(8, 8, 8, 8);
            diseaseLayout.addView(cb);
            diseaseCheckBoxes.add(cb);
        }

        btnNext.setOnClickListener(v -> {
            StringBuilder diseases = new StringBuilder();
            for (CheckBox cb : diseaseCheckBoxes) {
                if (cb.isChecked()) {
                    if (diseases.length() > 0) diseases.append(", ");
                    diseases.append(cb.getText());
                }
            }

            Intent intent = new Intent(HealthInfoActivity.this, MigrationInfoActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("health_insurance", spinnerInsurance.getSelectedItem().toString());
            intent.putExtra("covid_vaccination", spinnerVaccination.getSelectedItem().toString());
            intent.putExtra("physical_activity", spinnerActivity.getSelectedItem().toString());
            intent.putExtra("nearest_healthcare", spinnerHealthcare.getSelectedItem().toString());
            intent.putExtra("chronic_diseases", diseases.toString());
            startActivity(intent);
        });

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }

    private void setupSpinner(Spinner spinner, String[] items) {
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, items);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
    }
}