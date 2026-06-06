package com.example.jansankhya;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(entities = {CensusRecord.class}, version = 1)
public abstract class AppDatabase extends RoomDatabase {
    public abstract CensusRecordDao censusRecordDao();

    private static AppDatabase instance;

    public static AppDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(
                    context.getApplicationContext(),
                    AppDatabase.class,
                    "jansankhya_db"
            ).build();
        }
        return instance;
    }
}