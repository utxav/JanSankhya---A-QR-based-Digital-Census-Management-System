package com.example.jansankhya;

import android.content.Context;
import android.content.SharedPreferences;

public class Constants {
    private static final String DEFAULT_IP = "172.20.10.5";

    public static String getBaseUrl(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("jansankhya", Context.MODE_PRIVATE);
        String ip = prefs.getString("server_ip", DEFAULT_IP);
        return "http://" + ip + "/jansankhya-api";
    }

    public static String getLoginUrl(Context context) {
        return getBaseUrl(context) + "/auth/login.php";
    }

    public static String getCitizensAddUrl(Context context) {
        return getBaseUrl(context) + "/citizens/add.php";
    }

    public static String getCitizensGetUrl(Context context) {
        return getBaseUrl(context) + "/citizens/get.php";
    }

    public static String getCensusStatsUrl(Context context) {
        return getBaseUrl(context) + "/census/stats.php";
    }

    public static String getCensusSubmitUrl(Context context) {
        return getBaseUrl(context) + "/census/submit.php";
    }

    public static final String USER_AGENT = "Mozilla/5.0 (Android; Mobile)";
}

