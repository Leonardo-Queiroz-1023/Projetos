# Estágio 1: Build do Frontend (React)
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend

COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm install

COPY Frontend/ ./
RUN npm run build


# Estágio 2: Build do Backend (Spring Boot)
FROM maven:3.9-eclipse-temurin-21 as backend-builder
WORKDIR /app/backend

# Copia arquivos de configuração do Maven
COPY Backend/pom.xml .
COPY Backend/.mvn ./.mvn
COPY Backend/mvnw .
RUN chmod +x mvnw

# Download de dependências (cache layer)
RUN mvn dependency:go-offline -B || true

# Copia TODO o código fonte
COPY Backend/src ./src

# Copia o frontend build para static
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Build do JAR
RUN mvn clean package -DskipTests


# Estágio 3: Imagem Final de Produção
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# ✅ Render usa a variável PORT dinamicamente
EXPOSE ${PORT:-8080}

# Copia o JAR
COPY --from=backend-builder /app/backend/target/*.jar ./app.jar

# ✅ Configurações do banco via ENV (Render permite sobrescrever)
ENV SPRING_DATASOURCE_URL=jdbc:h2:mem:projetosdb
ENV SPRING_DATASOURCE_USERNAME=sa
ENV SPRING_DATASOURCE_PASSWORD=
ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.h2.Driver
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.H2Dialect
ENV SPRING_H2_CONSOLE_ENABLED=false

# ✅ IMPORTANTE: Render injeta a variável PORT, Spring precisa escutar nela
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]