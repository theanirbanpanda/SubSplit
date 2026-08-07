package com.subsplit.common.config;

import com.subsplit.common.entity.Role;
import com.subsplit.common.entity.User;
import com.subsplit.common.entity.UserProfile;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.subscription.entity.Category;
import com.subsplit.subscription.entity.Subscription;
import com.subsplit.subscription.entity.SubscriptionPlan;
import com.subsplit.subscription.repository.CategoryRepository;
import com.subsplit.subscription.repository.SubscriptionPlanRepository;
import com.subsplit.subscription.repository.SubscriptionRepository;
import com.subsplit.user.repository.RoleRepository;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final ListingRepository listingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Executing database seed data initialization...");

        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(Role.builder().name("USER").description("Regular User").build());
        }

        Role hostRole = roleRepository.findByName("HOST")
                .orElseGet(() -> roleRepository.save(Role.builder().name("HOST").description("Host User").build()));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").description("System Admin").build()));

        // 0. Seed Default System Admin
        createAdminIfNotFound("subadmin@admin.com", "subadmin", "SubSplit", "Admin", adminRole);


        // 1. Seed Hosts

        User host1 = createHostIfNotFound("vikram@subsplit.com", "Vikram", "S.", hostRole,
                "Verified SubSplit super host managing top streaming & productivity groups.");
        User host2 = createHostIfNotFound("ananya@subsplit.com", "Ananya", "R.", hostRole,
                "Music enthusiast and long-time Spotify host.");
        User host3 = createHostIfNotFound("rohan@subsplit.com", "Rohan", "K.", hostRole,
                "AI researcher and startup founder sharing developer workspace seats.");
        User host4 = createHostIfNotFound("saurabh@subsplit.com", "Saurabh", "M.", hostRole,
                "Verified host with automated invite onboarding.");
        User host5 = createHostIfNotFound("neha@subsplit.com", "Neha", "Sharma", hostRole,
                "Freelance designer sharing enterprise team slots.");

        // 2. Seed Categories
        Category catOtt = createCategoryIfNotFound("OTT", "Streaming video & movies", "Theaters");
        Category catMusic = createCategoryIfNotFound("Music", "Audio streaming & podcasts", "MusicNote");
        Category catAi = createCategoryIfNotFound("AI Tools", "Artificial intelligence & LLMs", "AutoAwesome");
        Category catProductivity = createCategoryIfNotFound("Productivity", "Workspace & design apps", "Assignment");
        Category catCloud = createCategoryIfNotFound("Cloud Storage", "Online cloud backup & storage", "Cloud");
        Category catGaming = createCategoryIfNotFound("Gaming", "Console & PC gaming passes", "Games");
        Category catEdu = createCategoryIfNotFound("Learning", "Courses & skill development", "MenuBook");

        // 3. Seed Subscriptions & Plans
        Subscription nflx = createSubscriptionIfNotFound("Netflix", catOtt,
                "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico", "https://netflix.com");
        SubscriptionPlan nflxPlan = createPlanIfNotFound(nflx, "Premium 4K UHD", 4, new BigDecimal("649.00"));

        Subscription sptf = createSubscriptionIfNotFound("Spotify", catMusic,
                "https://open.spotifycdn.com/cdn/images/favicon.54780371.ico", "https://spotify.com");
        SubscriptionPlan sptfPlan = createPlanIfNotFound(sptf, "Family Plan 6 Screens", 6, new BigDecimal("179.00"));

        Subscription gpt = createSubscriptionIfNotFound("ChatGPT", catAi,
                "https://oaistatic-cdn.azureedge.net/chatgpt/favicon.ico", "https://chatgpt.com");
        SubscriptionPlan gptPlan = createPlanIfNotFound(gpt, "Team Workspace Pass", 5, new BigDecimal("1999.00"));

        Subscription yt = createSubscriptionIfNotFound("YouTube", catOtt,
                "https://www.youtube.com/s/desktop/favicon.ico", "https://youtube.com");
        SubscriptionPlan ytPlan = createPlanIfNotFound(yt, "Premium Family 5 Slots", 5, new BigDecimal("149.00"));

        Subscription cnv = createSubscriptionIfNotFound("Canva", catProductivity,
                "https://static.canva.com/static/images/favicon.ico", "https://canva.com");
        SubscriptionPlan cnvPlan = createPlanIfNotFound(cnv, "Pro Enterprise Team", 10, new BigDecimal("499.00"));

        Subscription ms365 = createSubscriptionIfNotFound("Microsoft 365", catCloud,
                "https://res-1.cdn.office.net/files/fabric-cdn-prod_v4.5.2/assets/brand-icons/product/svg/office_365_16x1.svg",
                "https://office.com");
        SubscriptionPlan msPlan = createPlanIfNotFound(ms365, "Family 6 Members + 1TB", 6, new BigDecimal("619.00"));

        Subscription ps = createSubscriptionIfNotFound("PlayStation", catGaming,
                "https://www.playstation.com/favicon.ico", "https://playstation.com");
        SubscriptionPlan psPlan = createPlanIfNotFound(ps, "Deluxe Game Catalog Pass", 3, new BigDecimal("849.00"));

        Subscription udm = createSubscriptionIfNotFound("Udemy", catEdu,
                "https://www.udemy.com/static/images/favicon-32x32.png", "https://udemy.com");
        SubscriptionPlan udmPlan = createPlanIfNotFound(udm, "Pro Learning Pass", 5, new BigDecimal("799.00"));

        // 4. Seed Listings if less than 8 exist
        if (listingRepository.count() < 8) {
            log.info("Seeding initial marketplace listings into database...");

            createListingIfNotFound(host1, nflxPlan, "Netflix Premium 4K UHD",
                    "Get your dedicated screen slot on an official Netflix Premium 4K UHD subscription. Enjoy spatial audio and 4K streaming.",
                    new BigDecimal("129.00"), 4, 2, BillingCycle.MONTHLY);
            createListingIfNotFound(host2, sptfPlan, "Spotify Family Plan",
                    "Join a verified Spotify Premium Family group. Keep your personal account and playlists with ad-free music.",
                    new BigDecimal("59.00"), 6, 4, BillingCycle.MONTHLY);
            createListingIfNotFound(host3, gptPlan, "ChatGPT Plus Team Plan",
                    "Access ChatGPT Plus with GPT-4o, DALL-E 3, Advanced Data Analysis, and Custom GPTs in a private workspace.",
                    new BigDecimal("399.00"), 5, 3, BillingCycle.MONTHLY);
            createListingIfNotFound(host4, ytPlan, "YouTube Premium Family",
                    "Enjoy completely ad-free YouTube videos, background playback, offline downloads, and YouTube Music Premium.",
                    new BigDecimal("106.00"), 5, 2, BillingCycle.MONTHLY);
            createListingIfNotFound(host5, cnvPlan, "Canva Pro Enterprise Team",
                    "Unlock 100M+ premium stock photos, brand kits, background remover, and Canva Magic AI tools.",
                    new BigDecimal("89.00"), 10, 5, BillingCycle.MONTHLY);
            createListingIfNotFound(host1, msPlan, "Microsoft 365 Family",
                    "Full access to Word, Excel, PowerPoint, Outlook, and 1TB private OneDrive cloud storage.",
                    new BigDecimal("149.00"), 6, 3, BillingCycle.MONTHLY);
            createListingIfNotFound(host3, psPlan, "PlayStation Plus Deluxe",
                    "Access 400+ PS5/PS4 games, classic Ubisoft+ titles, online multiplayer, and monthly free downloads.",
                    new BigDecimal("249.00"), 3, 1, BillingCycle.MONTHLY);
            createListingIfNotFound(host2, udmPlan, "Udemy Pro Learning Pass",
                    "Unlimited access to 11,000+ top courses in web dev, data science, AI, business, and cloud certification prep.",
                    new BigDecimal("199.00"), 5, 4, BillingCycle.MONTHLY);

            log.info("Seeded initial marketplace listings successfully!");
        }
    }

    private User createHostIfNotFound(String email, String firstName, String lastName, Role role, String bio) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .fullName((firstName + " " + lastName).trim())
                    .passwordHash(passwordEncoder.encode("HostPassword123!"))
                    .role(role)
                    .isActive(true)
                    .emailVerified(true)
                    .build();

            UserProfile profile = UserProfile.builder()
                    .user(user)
                    .bio(bio)
                    .state("Maharashtra")
                    .city("Mumbai")
                    .build();
            user.setProfile(profile);

            return userRepository.save(user);
        });
    }

    private User createAdminIfNotFound(String email, String password, String firstName, String lastName, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .fullName((firstName + " " + lastName).trim())
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .isActive(true)
                    .emailVerified(true)
                    .build();

            UserProfile profile = UserProfile.builder()
                    .user(user)
                    .bio("SubSplit System Administrator Control Center Account")
                    .state("Maharashtra")
                    .city("Mumbai")
                    .build();
            user.setProfile(profile);

            log.info("Created default system admin user: {}", email);
            return userRepository.save(user);
        });
    }

    private Category createCategoryIfNotFound(String name, String description, String icon) {

        List<Category> list = categoryRepository.findAll();
        for (Category c : list) {
            if (c.getCategoryName().equalsIgnoreCase(name)) {
                return c;
            }
        }
        return categoryRepository.save(Category.builder()
                .categoryName(name)
                .description(description)
                .icon(icon)
                .monthlyPrice(BigDecimal.ZERO)
                .active(true)
                .build());
    }

    private Subscription createSubscriptionIfNotFound(String providerName, Category category, String logoUrl,
            String officialWebsite) {
        List<Subscription> list = subscriptionRepository.findAll();
        for (Subscription s : list) {
            if (s.getProviderName().equalsIgnoreCase(providerName)) {
                return s;
            }
        }
        return subscriptionRepository.save(Subscription.builder()
                .providerName(providerName)
                .planName(providerName)
                .maxMembers(4)
                .monthlyPrice(new BigDecimal("199.00"))
                .yearlyPrice(new BigDecimal("1999.00"))
                .category(category)
                .logoUrl(logoUrl)
                .officialWebsite(officialWebsite)
                .active(true)
                .build());
    }

    private SubscriptionPlan createPlanIfNotFound(Subscription subscription, String planName, Integer maxMembers,
            BigDecimal monthlyPrice) {
        List<SubscriptionPlan> plans = subscriptionPlanRepository.findBySubscriptionId(subscription.getId());
        if (!plans.isEmpty())
            return plans.get(0);

        return subscriptionPlanRepository.save(SubscriptionPlan.builder()
                .subscription(subscription)
                .planName(planName)
                .maxMembers(maxMembers)
                .monthlyPrice(monthlyPrice)
                .yearlyPrice(monthlyPrice.multiply(BigDecimal.valueOf(10)))
                .sharingAllowed(true)
                .active(true)
                .build());
    }

    private void createListingIfNotFound(User host, SubscriptionPlan plan, String title, String description, BigDecimal seatPrice,
            Integer totalSeats, Integer availableSeats, BillingCycle cycle) {
        List<Listing> existing = listingRepository.findAll();
        for (Listing l : existing) {
            if (l.getTitle().equalsIgnoreCase(title)) {
                return;
            }
        }

        Listing listing = Listing.builder()
                .host(host)
                .plan(plan)
                .title(title)
                .description(description)
                .seatPrice(seatPrice)
                .monthlyPrice(seatPrice)
                .totalSeats(totalSeats)
                .availableSeats(availableSeats)
                .billingCycle(cycle)
                .status(ListingStatus.ACTIVE)
                .startDate(LocalDate.now())
                .expiryDate(LocalDate.now().plusMonths(1))
                .build();

        listingRepository.save(listing);
    }
}
