package com.subsplit.common.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvLoader {
    public static void load() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        setSystemProperty("DB_HOST", dotenv.get("DB_HOST"));
        setSystemProperty("DB_PORT", dotenv.get("DB_PORT"));
        setSystemProperty("DB_NAME", dotenv.get("DB_NAME"));
        setSystemProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        setSystemProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
    }

    private static void setSystemProperty(String key, String value) {
        if (value != null) {
            System.setProperty(key, value);
        }
    }
}
