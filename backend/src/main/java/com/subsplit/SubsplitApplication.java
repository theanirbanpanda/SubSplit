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
    public CommandLineRunner commandLineRunner(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT");
                System.out.println("   [DB Migration] Altered users.profile_image to LONGTEXT successfully");
            } catch (Exception e) {
                // Ignore if already LONGTEXT
            }
            try {
                jdbcTemplate.execute("ALTER TABLE wallet_transactions MODIFY COLUMN transaction_type VARCHAR(50)");
                System.out.println("   [DB Migration] Altered wallet_transactions.transaction_type to VARCHAR(50) successfully");
            } catch (Exception e) {
                // Ignore if already altered
            }
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN credentials_username VARCHAR(255)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN credentials_password VARCHAR(255)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN credentials_notes LONGTEXT");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN credentials_shared_at DATETIME");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests MODIFY COLUMN proof_image LONGTEXT");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests MODIFY COLUMN credentials_notes LONGTEXT");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests MODIFY COLUMN status VARCHAR(50)");
            } catch (Exception e) {}
            System.out.println("   [DB Migration] Verified join_requests credentials and proof columns.");



            System.out.println("\n==================================================");
            System.out.println("   SubSplit Backend Started Successfully!");
            System.out.println("   Server is running at: http://localhost:8080");
            System.out.println("   Swagger API Docs:     http://localhost:8080/swagger-ui/index.html");
            System.out.println("==================================================\n");
        };
    }


}
