package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class EmploymentInfoActivity extends AppCompatActivity {

    Spinner spinnerEmployment, spinnerIncomeCategory;
    EditText etOccupation, etMonthlyIncome;
    Button btnNext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_employment_info);

        spinnerEmployment = findViewById(R.id.spinnerEmployment);
        spinnerIncomeCategory = findViewById(R.id.spinnerIncomeCategory);
        etOccupation = findViewById(R.id.etOccupation);
        etMonthlyIncome = findViewById(R.id.etMonthlyIncome);
        btnNext = findViewById(R.id.btnNext);

        setupSpinner(spinnerEmployment, new String[]{"Employed","Self-Employed","Farmer","Student","Homemaker","Unemployed","Retired","Daily Wage Worker"});
        setupSpinner(spinnerIncomeCategory, new String[]{"BPL","Lower","Lower-Middle","Middle","Upper-Middle","High Income"});

        btnNext.setOnClickListener(v -> {
            Intent intent = new Intent(EmploymentInfoActivity.this, HomeInfoActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("employment_status", spinnerEmployment.getSelectedItem().toString());
            intent.putExtra("occupation", etOccupation.getText().toString().trim());
            intent.putExtra("monthly_income", etMonthlyIncome.getText().toString().trim());
            intent.putExtra("income_category", spinnerIncomeCategory.getSelectedItem().toString());
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