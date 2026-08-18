# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy pom and source code
COPY pom.xml .
COPY src ./src
# Build the application, skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (default Spring Boot port)
EXPOSE 8080

# Docker health check running every 10 minutes
HEALTHCHECK --interval=10m --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/v1/health || exit 1

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
