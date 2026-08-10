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
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN kyc_status VARCHAR(50)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN kyc_document_type VARCHAR(100)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE reviews MODIFY COLUMN membership_id BIGINT NULL");
                System.out.println("   [DB Migration] Altered reviews.membership_id to NULLABLE successfully");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE notifications MODIFY COLUMN notification_type VARCHAR(50)");
                System.out.println("   [DB Migration] Altered notifications.notification_type to VARCHAR(50) successfully");
            } catch (Exception e) {}
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
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN share_type VARCHAR(50)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN invitation_link VARCHAR(1000)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("ALTER TABLE join_requests ADD COLUMN activation_code VARCHAR(255)");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS conversations (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "participant1_id BIGINT NOT NULL, " +
                        "participant2_id BIGINT NOT NULL, " +
                        "listing_id BIGINT NULL, " +
                        "last_message TEXT NULL, " +
                        "last_message_at DATETIME NULL, " +
                        "unread_count_user1 INT DEFAULT 0, " +
                        "unread_count_user2 INT DEFAULT 0, " +
                        "created_at DATETIME NULL, " +
                        "updated_at DATETIME NULL)");
                System.out.println("   [DB Migration] Verified conversations table.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS messages (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "conversation_id BIGINT NOT NULL, " +
                        "sender_id BIGINT NOT NULL, " +
                        "receiver_id BIGINT NOT NULL, " +
                        "content TEXT NOT NULL, " +
                        "is_read BOOLEAN DEFAULT FALSE, " +
                        "created_at DATETIME NULL, " +
                        "updated_at DATETIME NULL)");
                System.out.println("   [DB Migration] Verified messages table.");
            } catch (Exception e) {}



            System.out.println("\n==================================================");
            System.out.println("   SubSplit Backend Started Successfully!");
            System.out.println("   Server is running at: http://localhost:8080");
            System.out.println("   Swagger API Docs:     http://localhost:8080/swagger-ui/index.html");
            System.out.println("==================================================\n");
        };
    }


}
