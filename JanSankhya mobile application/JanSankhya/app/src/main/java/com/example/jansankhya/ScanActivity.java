package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;
import androidx.activity.result.ActivityResultLauncher;
import org.json.JSONException;

public class ScanActivity extends AppCompatActivity {

    Button btnScan, btnManual;
    EditText etManualUid;
    TextView tvScannedData;
    RequestQueue requestQueue;

    private final ActivityResultLauncher<ScanOptions> barcodeLauncher =
            registerForActivityResult(new ScanContract(), result -> {
                if (result.getContents() != null) {
                    if (!NetworkHelper.isConnected(this)) {
                        tvScannedData.setText("⚠ Offline mode — proceeding without validation");
                        tvScannedData.setTextColor(0xFFFF9933);
                        Intent intent = new Intent(ScanActivity.this, HeadInfoActivity.class);
                        intent.putExtra("uid", result.getContents());
                        startActivity(intent);
                        return;
                    }
                    validateAndProceed(result.getContents());
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan);

        btnScan = findViewById(R.id.btnScan);
        btnManual = findViewById(R.id.btnManual);
        etManualUid = findViewById(R.id.etManualUid);
        tvScannedData = findViewById(R.id.tvScannedData);
        requestQueue = Volley.newRequestQueue(this);

        btnScan.setOnClickListener(v -> {
            ScanOptions options = new ScanOptions();
            options.setPrompt("Scan Citizen QR Code");
            options.setBeepEnabled(true);
            options.setOrientationLocked(false);
            barcodeLauncher.launch(options);
        });

        btnManual.setOnClickListener(v -> {
            String uid = etManualUid.getText().toString().trim();
            if (uid.isEmpty()) {
                tvScannedData.setText("Please enter a UID");
                return;
            }
            if (!NetworkHelper.isConnected(this)) {
                tvScannedData.setText("⚠ Offline mode — proceeding without validation");
                tvScannedData.setTextColor(0xFFFF9933);
                Intent intent = new Intent(ScanActivity.this, HeadInfoActivity.class);
                intent.putExtra("uid", uid);
                startActivity(intent);
                return;
            }
            validateAndProceed(uid);
        });

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void validateAndProceed(String uid) {
        tvScannedData.setText("Validating...");
        tvScannedData.setTextColor(0xFF757575);
        requestQueue.getCache().clear();

        String url = Constants.getCitizensGetUrl(this) + "?uid=" + uid;

        JsonObjectRequest request = new JsonObjectRequest(
                com.android.volley.Request.Method.GET,
                url,
                null,
                response -> {
                    try {
                        if (response.getBoolean("success")) {
                            tvScannedData.setText("✓ Citizen found! Proceeding...");
                            tvScannedData.setTextColor(0xFF43A047);
                            Intent intent = new Intent(ScanActivity.this, HeadInfoActivity.class);
                            intent.putExtra("uid", uid);
                            startActivity(intent);
                        } else {
                            boolean isDuplicate = response.optBoolean("duplicate", false);
                            if (isDuplicate) {
                                tvScannedData.setText("⚠ " + response.getString("message"));
                                tvScannedData.setTextColor(0xFFFF9933);
                            } else {
                                tvScannedData.setText("✗ " + response.getString("message"));
                                tvScannedData.setTextColor(0xFFE53935);
                            }
                        }
                    } catch (JSONException e) {
                        tvScannedData.setText("Error validating citizen");
                        tvScannedData.setTextColor(0xFFE53935);
                    }
                },
                error -> {
                    tvScannedData.setText("Cannot connect to server");
                    tvScannedData.setTextColor(0xFFE53935);
                }
        ) {
            @Override
            public com.android.volley.Cache.Entry getCacheEntry() {
                return null;
            }
        };

        request.setShouldCache(false);
        requestQueue.add(request);
    }

    @Override
    public boolean onSupportNavigateUp() {
        finish();
        return true;
    }
}