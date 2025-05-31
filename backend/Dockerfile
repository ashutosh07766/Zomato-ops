# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY . /app/backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-slim
WORKDIR /app

# Create necessary directories
RUN mkdir -p /var/lib/opspro /var/log/opspro

# Copy the built jar from build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8082
ENV SPRING_DATASOURCE_URL=jdbc:h2:file:/var/lib/opspro/opsprodb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
ENV SPRING_DATASOURCE_USERNAME=sa
ENV SPRING_DATASOURCE_PASSWORD=password
ENV ADMIN_USERNAME=admin
ENV ADMIN_PASSWORD=admin
ENV JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
ENV ALLOWED_ORIGINS=https://zomato-opspro-frontend.onrender.com

# Expose the application port
EXPOSE 8082

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 