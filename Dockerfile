# Estágio 1: Build do Frontend (React)
# Usamos uma imagem Node.js para instalar dependências e gerar os arquivos estáticos.
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend

# --- CORREÇÃO: Adicionado 'Projetos/' ao caminho ---
# Copia os arquivos de configuração de dependências primeiro para aproveitar o cache do Docker
COPY Projetos/Frontend/package.json Projetos/Frontend/package-lock.json ./
RUN npm install

# --- CORREÇÃO: Adicionado 'Projetos/' ao caminho ---
# Copia o resto do código do frontend
COPY Projetos/Frontend/ ./

# Roda o comando de build para gerar a pasta 'dist'
RUN npm run build


# Estágio 2: Build do Backend (Spring Boot)
# Usamos uma imagem Maven com JDK 21 para compilar o projeto Java.
FROM maven:3.9-eclipse-temurin-21 as backend-builder
WORKDIR /app/backend

# --- CORREÇÃO: Adicionado 'Projetos/' e separado os comandos COPY para clareza ---
# Copia a configuração do Maven primeiro para cachear as dependências
COPY Projetos/Backend/pom.xml .
COPY Projetos/Backend/.mvn ./.mvn
COPY Projetos/Backend/mvnw .
RUN mvn dependency:go-offline

# --- CORREÇÃO: Adicionado 'Projetos/' ao caminho ---
# Copia o código-fonte do backend
COPY Projetos/Backend/src ./src

# A MÁGICA: Copia os arquivos do frontend já construídos (do estágio anterior)
# para a pasta 'static' do Spring Boot.
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Empacota a aplicação Spring Boot em um .jar executável
RUN mvn package -DskipTests


# Estágio 3: Imagem Final de Produção
# Usamos uma imagem JRE (Java Runtime Environment) super leve, pois não precisamos mais do JDK completo.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Expõe a porta que a aplicação Spring Boot usa
EXPOSE 8080

# --- CORREÇÃO: Adicionado 'Projetos/' ao caminho de origem do .jar ---
# Copia o .jar final e executável do estágio de build do backend para a imagem final
COPY --from=backend-builder /app/backend/target/*.jar ./app.jar

# Comando para iniciar a aplicação quando o container for executado
ENTRYPOINT ["java", "-jar", "app.jar"]
