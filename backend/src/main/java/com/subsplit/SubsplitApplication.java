package com.subsplit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SubsplitApplication {

    static {
        com.subsplit.common.config.EnvLoader.load();
    }

    public static void main(String[] args) {
        SpringApplication.run(SubsplitApplication.class, args);
    }

}
