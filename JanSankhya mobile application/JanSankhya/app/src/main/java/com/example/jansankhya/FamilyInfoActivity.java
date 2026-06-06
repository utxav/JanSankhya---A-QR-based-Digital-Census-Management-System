package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class FamilyInfoActivity extends AppCompatActivity {

    EditText etTotalMembers, etTotalMales, etTotalFemales,
            etTotalChildren, etSeniorCitizens, etEarningMembers;
    Spinner spinnerFamilyType;
    Button btnNext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_info);

        etTotalMembers = findViewById(R.id.etTotalPeople);
        etTotalMales = findViewById(R.id.etTotalMales);
        etTotalFemales = findViewById(R.id.etTotalFemales);
        etTotalChildren = findViewById(R.id.etTotalChildren);
        etSeniorCitizens = findViewById(R.id.etSeniorCitizens);
        etEarningMembers = findViewById(R.id.etEarningMembers);
        spinnerFamilyType = findViewById(R.id.spinnerFamilyType);
        btnNext = findViewById(R.id.btnNext);

        setupSpinner(spinnerFamilyType, new String[]{"Nuclear","Joint","Single Person","Single Parent"});

        btnNext.setOnClickListener(v -> {
            Intent intent = new Intent(FamilyInfoActivity.this, HealthInfoActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("total_people", etTotalMembers.getText().toString().trim());
            intent.putExtra("total_males", etTotalMales.getText().toString().trim());
            intent.putExtra("total_females", etTotalFemales.getText().toString().trim());
            intent.putExtra("total_children", etTotalChildren.getText().toString().trim());
            intent.putExtra("senior_citizens", etSeniorCitizens.getText().toString().trim());
            intent.putExtra("earning_members", etEarningMembers.getText().toString().trim());
            intent.putExtra("family_type", spinnerFamilyType.getSelectedItem().toString());
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