# Stage 1: build the jar
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: slim runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/injuryvision-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
