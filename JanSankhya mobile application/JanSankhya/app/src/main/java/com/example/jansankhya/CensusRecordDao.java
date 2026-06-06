package com.example.jansankhya;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import java.util.List;

@Dao
public interface CensusRecordDao {
    @Insert
    long insert(CensusRecord record);

    @Query("SELECT * FROM offline_records WHERE synced = 0")
    List<CensusRecord> getUnsynced();

    @Query("UPDATE offline_records SET synced = 1 WHERE id = :id")
    void markSynced(int id);

    @Query("SELECT COUNT(*) FROM offline_records WHERE synced = 0")
    int getUnsyncedCount();
}