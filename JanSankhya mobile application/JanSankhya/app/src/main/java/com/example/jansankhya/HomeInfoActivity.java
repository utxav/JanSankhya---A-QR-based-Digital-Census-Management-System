package com.example.jansankhya;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class HomeInfoActivity extends AppCompatActivity {

    Spinner spinnerHouseType, spinnerOwnership, spinnerToilet,
            spinnerDrinkingWater, spinnerElectricity, spinnerCookingFuel, spinnerInternet;
    EditText etNumRooms;
    Button btnNext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_info);

        spinnerHouseType = findViewById(R.id.spinnerHouseType);
        spinnerOwnership = findViewById(R.id.spinnerOwnership);
        spinnerToilet = findViewById(R.id.spinnerToilet);
        spinnerDrinkingWater = findViewById(R.id.spinnerDrinkingWater);
        spinnerElectricity = findViewById(R.id.spinnerElectricity);
        spinnerCookingFuel = findViewById(R.id.spinnerCookingFuel);
        spinnerInternet = findViewById(R.id.spinnerInternet);
        etNumRooms = findViewById(R.id.etNumRooms);
        btnNext = findViewById(R.id.btnNext);

        setupSpinner(spinnerHouseType, new String[]{"Pucca","Semi-Pucca","Kutcha"});
        setupSpinner(spinnerOwnership, new String[]{"Owned","Rented","Leased","Government Quarters"});
        setupSpinner(spinnerToilet, new String[]{"Flush","Pit Latrine","Open Defecation","None"});
        setupSpinner(spinnerDrinkingWater, new String[]{"Municipal Tap","Hand Pump","Tubewell","Well","River/Pond","Tanker"});
        setupSpinner(spinnerElectricity, new String[]{"Grid","Solar Panel","Generator","Kerosene Lamp","No Electricity"});
        setupSpinner(spinnerCookingFuel, new String[]{"LPG/PNG","Firewood","Cow Dung Cake","Kerosene","Biogas"});
        setupSpinner(spinnerInternet, new String[]{"Broadband","Mobile Data (4G/5G)","Mobile Data (2G/3G)","No Internet"});

        btnNext.setOnClickListener(v -> {
            Intent intent = new Intent(HomeInfoActivity.this, FamilyInfoActivity.class);
            Bundle extras = getIntent().getExtras();
            if (extras != null) intent.putExtras(extras);
            intent.putExtra("house_type", spinnerHouseType.getSelectedItem().toString());
            intent.putExtra("ownership", spinnerOwnership.getSelectedItem().toString());
            intent.putExtra("toilet_type", spinnerToilet.getSelectedItem().toString());
            intent.putExtra("drinking_water", spinnerDrinkingWater.getSelectedItem().toString());
            intent.putExtra("electricity", spinnerElectricity.getSelectedItem().toString());
            intent.putExtra("cooking_fuel", spinnerCookingFuel.getSelectedItem().toString());
            intent.putExtra("internet", spinnerInternet.getSelectedItem().toString());
            intent.putExtra("num_rooms", etNumRooms.getText().toString().trim());
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