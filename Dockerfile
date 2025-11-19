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

# ✅ VERIFICAÇÃO: Lista os arquivos resources para debug
RUN echo "=== Verificando resources ===" && \
    ls -la src/main/resources/ && \
    cat src/main/resources/application.properties

# Copia o frontend build para static
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# ✅ VERIFICAÇÃO: Confirma que application.properties ainda existe
RUN echo "=== Após copiar frontend ===" && \
    ls -la src/main/resources/ && \
    test -f src/main/resources/application.properties && echo "✓ application.properties encontrado" || echo "✗ application.properties PERDIDO"

# Build do JAR
RUN mvn clean package -DskipTests

# ✅ VERIFICAÇÃO: Verifica se application.properties está no JAR
RUN echo "=== Verificando JAR ===" && \
    ls -la target/*.jar && \
    jar tf target/*.jar | grep application.properties && echo "✓ application.properties no JAR" || echo "✗ application.properties NÃO está no JAR"


# Estágio 3: Imagem Final de Produção
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

EXPOSE 8080

# Copia o JAR
COPY --from=backend-builder /app/backend/target/*.jar ./app.jar

# Comando de inicialização
ENTRYPOINT ["java", "-jar", "app.jar"]