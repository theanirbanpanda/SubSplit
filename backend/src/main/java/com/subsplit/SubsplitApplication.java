package com.subsplit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SubsplitApplication {

    static {
        com.subsplit.common.config.EnvLoader.load();
    }

    public static void main(String[] args) {
        SpringApplication.run(SubsplitApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            System.out.println("\n==================================================");
            System.out.println("   SubSplit Backend Started Successfully!");
            System.out.println("   Server is running at: http://localhost:8080");
            System.out.println("   Swagger API Docs:     http://localhost:8080/swagger-ui/index.html");
            System.out.println("==================================================\n");
        };
    }

}
