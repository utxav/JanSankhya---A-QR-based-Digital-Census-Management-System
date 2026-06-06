package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class HeadInfoActivity extends AppCompatActivity {

    Spinner spinnerEducation, spinnerFieldOfStudy, spinnerBloodGroup, spinnerDisability;
    Button btnNext;
    String uid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_head_info);

        uid = getIntent().getStringExtra("uid");

        spinnerEducation = findViewById(R.id.spinnerEducation);
        spinnerFieldOfStudy = findViewById(R.id.spinnerFieldOfStudy);
        spinnerBloodGroup = findViewById(R.id.spinnerBloodGroup);
        spinnerDisability = findViewById(R.id.spinnerDisability);
        btnNext = findViewById(R.id.btnNext);

        setupSpinner(spinnerEducation, new String[]{"No Education","Primary","Middle","Secondary","Higher Secondary","Diploma","Bachelor","Master","PhD"});
        setupSpinner(spinnerFieldOfStudy, new String[]{"Select","Science","Commerce","Arts","Engineering","Medicine","Law","Agriculture","Others"});
        setupSpinner(spinnerBloodGroup, new String[]{"A+","A-","B+","B-","AB+","AB-","O+","O-"});
        setupSpinner(spinnerDisability, new String[]{"None","Visual","Physical","Hearing","Cognitive","Multiple"});

        btnNext.setOnClickListener(v -> {
            Intent intent = new Intent(HeadInfoActivity.this, EmploymentInfoActivity.class);
            intent.putExtra("uid", uid);
            intent.putExtra("education", spinnerEducation.getSelectedItem().toString());
            intent.putExtra("field_of_study", spinnerFieldOfStudy.getSelectedItem().toString());
            intent.putExtra("blood_group", spinnerBloodGroup.getSelectedItem().toString());
            intent.putExtra("disability", spinnerDisability.getSelectedItem().toString());
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