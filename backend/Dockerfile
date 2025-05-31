# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-slim
WORKDIR /app

# Create necessary directories
RUN mkdir -p /var/lib/opspro /var/log/opspro

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_USERNAME=sa
ENV DB_PASSWORD=password
ENV ADMIN_USERNAME=admin
ENV ADMIN_PASSWORD=admin
ENV JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
ENV ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Expose the application port
EXPOSE 8082

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 