package com.example.jansankhya;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    EditText etUsername, etPassword;
    Button btnLogin;
    TextView tvError;
    RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        tvError = findViewById(R.id.tvError);
        requestQueue = Volley.newRequestQueue(this);

        btnLogin.setOnClickListener(v -> attemptLogin());
    }

    private void attemptLogin() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (username.isEmpty() || password.isEmpty()) {
            tvError.setText("Please enter username and password");
            return;
        }

        btnLogin.setEnabled(false);
        tvError.setText("");

        JSONObject params = new JSONObject();
        try {
            params.put("id", username);
            params.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.POST,
                Constants.getLoginUrl(this),
                params,
                response -> {
                    try {
                        boolean success = response.getBoolean("success");
                        if (success) {
                            JSONObject user = response.getJSONObject("user");
                            SharedPreferences prefs = getSharedPreferences("jansankhya", MODE_PRIVATE);
                            prefs.edit()
                                    .putString("user_id", user.getString("id"))
                                    .putString("user_name", user.getString("name"))
                                    .putString("user_role", user.getString("role"))
                                    .apply();
                            startActivity(new Intent(LoginActivity.this, HomeActivity.class));
                            finish();
                        } else {
                            tvError.setText(response.getString("message"));
                            btnLogin.setEnabled(true);
                        }
                    } catch (JSONException e) {
                        tvError.setText("Unexpected error. Try again.");
                        btnLogin.setEnabled(true);
                    }
                },
                error -> {
                    tvError.setText("Cannot connect to server. Check your network.");
                    btnLogin.setEnabled(true);
                }
        );

        requestQueue.add(request);
    }
}