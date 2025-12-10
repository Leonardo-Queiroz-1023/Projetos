# Estágio 1: Build do Frontend (React)
# Usamos uma imagem Node.js para instalar dependências e gerar os arquivos estáticos.
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend

# Copia os arquivos de configuração de dependências primeiro para aproveitar o cache do Docker
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm install

# Copia o resto do código do frontend
COPY Frontend/ ./

# Roda o comando de build para gerar a pasta 'dist'
RUN npm run build


# Estágio 2: Build do Backend (Spring Boot)
# Usamos uma imagem Maven com JDK 21 para compilar o projeto Java.
FROM maven:3.9-eclipse-temurin-21 as backend-builder
WORKDIR /app/backend

# Copia a configuração do Maven primeiro para cachear as dependências
COPY Backend/pom.xml .
COPY Backend/.mvn ./.mvn
COPY Backend/mvnw .
RUN mvn dependency:go-offline

#
# Copia o código-fonte do backend
COPY Backend/src ./src

COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Empacota a aplicação Spring Boot em um .jar executável
RUN mvn package -DskipTests


# Estágio 3: Imagem Final de Produção
# Usamos uma imagem JRE (Java Runtime Environment) super leve, pois não precisamos mais do JDK completo.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Expõe a porta que a aplicação Spring Boot usa
EXPOSE 8080

# --- CORREÇÃO: Removido 'Projetos/' ---
# Copia o .jar final e executável do estágio de build do backend para a imagem final
COPY --from=backend-builder /app/backend/target/*.jar ./app.jar

# Comando para iniciar a aplicação quando o container for executado
ENTRYPOINT ["java", "-jar", "app.jar"]