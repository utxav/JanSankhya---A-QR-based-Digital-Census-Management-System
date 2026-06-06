package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;

public class GovtSchemesActivity extends AppCompatActivity {

    Spinner spinnerRationCard, spinnerBankAccount;
    Button btnNext;
    String[] schemeOptions = {"PM Awas Yojana","Ayushman Bharat","PM Kisan","Mudra Loan","MNREGA","Ujjwala Yojana","Beti Bachao","None"};
    ArrayList<CheckBox> schemeCheckBoxes = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_govt_schemes);

        spinnerRationCard = findViewById(R.id.spinnerRationCard);
        spinnerBankAccount = findViewById(R.id.spinnerBankAccount);
        btnNext = findViewById(R.id.btnNext);
        LinearLayout schemesLayout = findViewById(R.id.schemesLayout);

        setupSpinner(spinnerRationCard, new String[]{"APL","BPL","AAY (Antyodaya)","PHH","None"});
        setupSpinner(spinnerBankAccount, new String[]{"Yes - Regular","Yes - Jan Dhan","No"});

        for (String scheme : schemeOptions) {
            CheckBox cb = new CheckBox(this);
            cb.setText(scheme);
            cb.setTextSize(14);
            cb.setPadding(8, 8, 8, 8);
            schemesLayout.addView(cb);
            schemeCheckBoxes.add(cb);
        }

        btnNext.setOnClickListener(v -> {
            StringBuilder schemes = new StringBuilder();
            for (CheckBox cb : schemeCheckBoxes) {
                if (cb.isChecked()) {
                    if (schemes.length() > 0) schemes.append(", ");
                    schemes.append(cb.getText());
                }
            }

            Intent intent = new Intent(GovtSchemesActivity.this, ConfirmActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("ration_card", spinnerRationCard.getSelectedItem().toString());
            intent.putExtra("bank_account", spinnerBankAccount.getSelectedItem().toString());
            intent.putExtra("govt_schemes", schemes.toString());
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