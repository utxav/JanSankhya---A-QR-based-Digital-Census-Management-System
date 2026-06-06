package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class MigrationInfoActivity extends AppCompatActivity {

    Spinner spinnerMigrationStatus, spinnerStateOfOrigin, spinnerMigrationReason;
    EditText etMigrationYear;
    LinearLayout migrationDetailsLayout;
    Button btnNext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_migration_info);

        spinnerMigrationStatus = findViewById(R.id.spinnerMigrationStatus);
        spinnerStateOfOrigin = findViewById(R.id.spinnerStateOfOrigin);
        spinnerMigrationReason = findViewById(R.id.spinnerMigrationReason);
        etMigrationYear = findViewById(R.id.etMigrationYear);
        migrationDetailsLayout = findViewById(R.id.migrationDetailsLayout);
        btnNext = findViewById(R.id.btnNext);

        setupSpinner(spinnerMigrationStatus, new String[]{"Native","Migrated from another state","Migrated from another district"});
        setupSpinner(spinnerStateOfOrigin, new String[]{"Select State","Uttar Pradesh","Bihar","Rajasthan","West Bengal","Madhya Pradesh","Maharashtra","Gujarat","Andhra Pradesh","Tamil Nadu","Karnataka","Kerala","Punjab","Haryana","Other"});
        setupSpinner(spinnerMigrationReason, new String[]{"Select Reason","Employment","Education","Marriage","Business","Family","Natural Disaster"});

        spinnerMigrationStatus.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, View view, int position, long id) {
                migrationDetailsLayout.setVisibility(position == 0 ? View.GONE : View.VISIBLE);
            }
            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {}
        });

        migrationDetailsLayout.setVisibility(View.GONE);

        btnNext.setOnClickListener(v -> {
            Intent intent = new Intent(MigrationInfoActivity.this, GovtSchemesActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("migration_status", spinnerMigrationStatus.getSelectedItem().toString());
            intent.putExtra("state_of_origin", spinnerStateOfOrigin.getSelectedItem().toString());
            intent.putExtra("migration_reason", spinnerMigrationReason.getSelectedItem().toString());
            intent.putExtra("migration_year", etMigrationYear.getText().toString().trim());
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