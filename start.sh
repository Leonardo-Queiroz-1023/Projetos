#!/bin/sh

echo "🚀 Iniciando aplicação..."

# Se DATABASE_URL existe (Render PostgreSQL), usa ela
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Usando PostgreSQL do Render"
    # Render já injeta DATABASE_URL no formato correto
    exec java -Dserver.port=${PORT:-8080} \
         -Dspring.profiles.active=prod \
         -Dspring.datasource.url="$DATABASE_URL" \
         -jar app.jar
else
    echo "⚠️  DATABASE_URL não encontrada, usando H2 file-based"
    exec java -Dserver.port=${PORT:-8080} \
         -jar app.jar
fi
