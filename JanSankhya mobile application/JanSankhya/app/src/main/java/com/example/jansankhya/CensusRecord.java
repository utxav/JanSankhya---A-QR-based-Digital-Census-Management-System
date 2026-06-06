package com.example.jansankhya;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "offline_records")
public class CensusRecord {
    @PrimaryKey(autoGenerate = true)
    public int id;
    public String uid;
    public String enumeratorId;
    public String education;
    public String fieldOfStudy;
    public String bloodGroup;
    public String disability;
    public String employmentStatus;
    public String occupation;
    public String monthlyIncome;
    public String incomeCategory;
    public String houseType;
    public String ownership;
    public String toiletType;
    public String drinkingWater;
    public String electricity;
    public String cookingFuel;
    public String numRooms;
    public String internet;
    public String totalPeople;
    public String totalMales;
    public String totalFemales;
    public String totalChildren;
    public String seniorCitizens;
    public String earningMembers;
    public String familyType;
    public String healthInsurance;
    public String covidVaccination;
    public String physicalActivity;
    public String nearestHealthcare;
    public String chronicDiseases;
    public String migrationStatus;
    public String stateOfOrigin;
    public String migrationReason;
    public String migrationYear;
    public String rationCard;
    public String bankAccount;
    public String govtSchemes;
    public double latitude;
    public double longitude;
    public boolean synced;
}