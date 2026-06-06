package com.example.jansankhya;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONException;
import java.util.HashMap;
import java.util.Map;

public class HomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        SharedPreferences prefs = getSharedPreferences("jansankhya", MODE_PRIVATE);
        String name = prefs.getString("user_name", "Enumerator");
        String role = prefs.getString("user_role", "enumerator");
        String userId = prefs.getString("user_id", "");

        TextView tvWelcome = findViewById(R.id.tvWelcome);
        TextView tvRole = findViewById(R.id.tvRole);
        TextView tvTodaySurveys = findViewById(R.id.tvTodaySurveys);
        TextView tvTotalSurveys = findViewById(R.id.tvTotalSurveys);
        Button btnInsertRecord = findViewById(R.id.btnInsertRecord);
        Button btnLogout = findViewById(R.id.btnLogout);
        Button btnSettings = findViewById(R.id.btnSettings);
        btnSettings.setOnClickListener(v ->
                startActivity(new Intent(HomeActivity.this, SettingsActivity.class))
        );

        tvWelcome.setText("Welcome, " + name + "!");
        tvRole.setText(role.substring(0, 1).toUpperCase() + role.substring(1) + " · " + userId);

        RequestQueue queue = Volley.newRequestQueue(this);
        JsonObjectRequest request = new JsonObjectRequest(
                com.android.volley.Request.Method.GET,
                Constants.getCensusStatsUrl(this) + "?enumerator_id=" + userId,
                null,
                response -> {
                    try {
                        tvTodaySurveys.setText(String.valueOf(response.getInt("today")));
                        tvTotalSurveys.setText(String.valueOf(response.getInt("total")));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                },
                error -> {}
        ) {
            @Override
            public Map<String, String> getHeaders() {
                Map<String, String> headers = new HashMap<>();
                headers.put("User-Agent", Constants.USER_AGENT);
                return headers;
            }
        };
        queue.add(request);

        new Thread(() -> {
            int pendingCount = AppDatabase.getInstance(this)
                    .censusRecordDao().getUnsyncedCount();
            if (pendingCount > 0) {
                runOnUiThread(() -> {
                    TextView tvPending = new TextView(this);
                    tvPending.setText("⚠ " + pendingCount + " record(s) pending sync");
                    tvPending.setTextColor(0xFFFF9933);
                    tvPending.setTextSize(13);
                    tvPending.setPadding(44, 0, 44, 16);
                    ((android.widget.LinearLayout) findViewById(R.id.btnInsertRecord)
                            .getParent()).addView(tvPending, 0);
                });
            }
        }).start();

        btnInsertRecord.setOnClickListener(v ->
                startActivity(new Intent(HomeActivity.this, ScanActivity.class))
        );

        btnLogout.setOnClickListener(v -> {
            prefs.edit().clear().apply();
            startActivity(new Intent(HomeActivity.this, LoginActivity.class));
            finish();
        });
    }
}