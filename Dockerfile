# Use an official OpenJDK 21 image as the base image
FROM eclipse-temurin:21-jre

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the build context to the container
COPY backend/target/opspro-0.0.1-SNAPSHOT.jar app.jar

# Expose the default port for Spring Boot applications
EXPOSE 8080

# Set the entry point to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
