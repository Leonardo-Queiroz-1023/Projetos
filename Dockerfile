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

COPY Backend/pom.xml .
COPY Backend/.mvn ./.mvn
COPY Backend/mvnw .

# Dá permissão de execução
RUN chmod +x mvnw

# Download de dependências
RUN mvn dependency:go-offline -B

# ✅ CORREÇÃO: Copia TODO o src (incluindo resources/application.properties)
COPY Backend/src ./src

# ✅ IMPORTANTE: Copia o frontend DEPOIS de copiar o src para não sobrescrever resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# ✅ CORREÇÃO: Empacota com nome específico e limpa antes
RUN mvn clean package -DskipTests


# Estágio 3: Imagem Final de Produção
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

EXPOSE 8080

# ✅ CORREÇÃO: Usa nome específico do JAR
COPY --from=backend-builder /app/backend/target/*.jar ./app.jar

# ✅ OPCIONAL: Adiciona logs para debug
ENTRYPOINT ["java", "-jar", "app.jar"]