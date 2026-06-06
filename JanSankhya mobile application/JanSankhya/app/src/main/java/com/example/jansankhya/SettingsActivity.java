package com.example.jansankhya;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {

    EditText etIpAddress;
    Button btnSave;
    TextView tvCurrent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        etIpAddress = findViewById(R.id.etIpAddress);
        btnSave = findViewById(R.id.btnSave);
        tvCurrent = findViewById(R.id.tvCurrent);

        SharedPreferences prefs = getSharedPreferences("jansankhya", MODE_PRIVATE);
        String currentIp = prefs.getString("server_ip", "192.168.31.14");
        tvCurrent.setText("Current IP: " + currentIp);
        etIpAddress.setText(currentIp);

        btnSave.setOnClickListener(v -> {
            String newIp = etIpAddress.getText().toString().trim();
            if (newIp.isEmpty()) {
                tvCurrent.setText("Please enter a valid IP address");
                return;
            }
            prefs.edit().putString("server_ip", newIp).apply();
            tvCurrent.setText("✓ Saved! Current IP: " + newIp);
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
}