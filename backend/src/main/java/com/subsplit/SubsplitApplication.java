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

            // ── current_price migration (master catalog Excel data) ──────────────
            try {
                jdbcTemplate.execute("ALTER TABLE subscriptions ADD COLUMN current_price DECIMAL(10,2)");
                System.out.println("   [DB Migration] Added subscriptions.current_price column.");
            } catch (Exception e) {
                // Column already exists
            }
            // Populate current_price values from the master catalog
            // (Product Name + Plan Name) -> Current Price INR
            String[][] catalogPrices = {
                // Design & Creative
                {"Canva Business",                     "299"},
                {"Figma Professional",                  "1499"},
                {"Creative Cloud Standard for teams",   "3187"},
                {"Creative Cloud Pro for teams",        "4405"},
                {"Adobe Express Teams",                 "419"},
                {"Miro Business",                      "1499"},
                {"Sketch for Teams",                   "899"},
                {"Framer Pro",                         "999"},
                {"Visme Business",                     "999"},
                {"Piktochart Pro",                     "699"},
                {"Premiere Pro for teams",              "3019"},
                {"After Effects for teams",             "3019"},
                {"Audition for teams",                 "3019"},
                {"Frame.io for Creative Cloud",        "799"},
                // Productivity
                {"Microsoft 365 Family",               "1499"},
                {"Microsoft 365 Business Basic",       "179"},
                {"Business Starter",                   "193"},
                {"Business Standard",                  "1040"},
                {"Notion Business",                    "799"},
                {"Slack Pro",                          "649"},
                {"Zoho Workplace Standard",            "249"},
                {"ClickUp Business",                   "699"},
                {"Asana Starter",                      "799"},
                {"monday work management Pro",         "999"},
                {"Evernote Teams",                     "899"},
                {"Todoist Business",                   "399"},
                {"Grammarly Business",                 "999"},
                {"Calendly Teams",                     "1499"},
                // Cloud Storage
                {"Google One Premium",                 "149"},
                {"Google AI Pro",                      "349"},
                {"Dropbox Family",                     "499"},
                {"Proton Family",                      "799"},
                {"Box Business",                       "599"},
                {"pCloud Business",                    "699"},
                {"Sync Pro Teams",                     "699"},
                // Security & Privacy
                {"1Password Families",                 "899"},
                {"Bitwarden Families",                 "799"},
                {"Proton Pass Family",                 "999"},
                {"Bitdefender Family",                 "699"},
                {"Norton 360 Deluxe",                  "499"},
                {"Norton 360 Premium",                 "699"},
                {"Kaspersky Premium",                  "599"},
                {"Kaspersky Plus",                     "499"},
                {"McAfee+ Premium Family",             "799"},
                {"Avast Premium Security",             "499"},
                {"Surfshark VPN",                      "199"},
                {"Proton VPN Plus",                    "299"},
                // Developer Tools
                {"GitHub Team",                        "349"},
                {"GitHub Enterprise",                  "2999"},
                {"GitLab Premium",                     "1999"},
                {"All Products Pack",                  "1499"},
                {"dotUltimate",                        "1299"},
                {"Postman Professional",               "1299"},
                {"BrowserStack Team",                  "1999"},
                {"Sentry Team",                        "799"},
                {"Jira Standard",                      "699"},
                // Multimedia & Entertainment
                {"YouTube Premium Family",             "99"},
                {"Spotify Premium Family",             "99"},
                {"Apple Music Family",                 "79"},
            };
            for (String[] entry : catalogPrices) {
                try {
                    jdbcTemplate.update(
                        "UPDATE subscriptions SET current_price = ? WHERE plan_name = ? AND (current_price IS NULL OR current_price = 0)",
                        new java.math.BigDecimal(entry[1]), entry[0]
                    );
                } catch (Exception e) {
                    // Skip if plan not found in DB
                }
            }
            System.out.println("   [DB Migration] Populated subscriptions.current_price from master catalog.");
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
