# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependencies list and install
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Build the Spring Boot Backend
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-builder
WORKDIR /app

# Copy root pom and backend code
COPY pom.xml ./
COPY backend/pom.xml ./backend/
COPY backend/src ./backend/src

# Inject React built static files into Spring Boot's resource static folder
COPY --from=frontend-builder /app/frontend/dist /app/backend/src/main/resources/static

# Build Maven JAR
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 3: Final Execution Image
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Copy compiled JAR from Stage 2
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Run the unified Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
