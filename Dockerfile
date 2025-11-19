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

# Copia script de inicialização
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Cria diretório para persistência do H2 (fallback)
RUN mkdir -p /data
VOLUME /data

# ✅ IMPORTANTE: Render injeta PORT e DATABASE_URL automaticamente
ENTRYPOINT ["/app/start.sh"]