# Projetos - Deploy no Render

## 🚀 Como fazer deploy no Render

### Opção 1: Usando o render.yaml (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [Render Dashboard](https://dashboard.render.com/)
3. Clique em "New +" → "Blueprint"
4. Conecte seu repositório GitHub
5. O Render detectará automaticamente o `render.yaml`
6. Clique em "Apply" - isso criará:
   - Um banco PostgreSQL gratuito
   - Um web service com o app

### Opção 2: Deploy manual (Docker)

1. No Render Dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório
3. Configure:
   - **Name**: meu-projeto-final
   - **Runtime**: Docker
   - **Branch**: entrega_atual (ou main)
   - **Plan**: Free

4. **Importante**: Adicione um banco de dados PostgreSQL:
   - Vá em "New +" → "PostgreSQL"
   - **Name**: projetos-db
   - **Plan**: Free
   - Copie a "Internal Database URL"

5. Volte ao Web Service e adicione variável de ambiente:
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a Internal Database URL do PostgreSQL

6. Clique em "Create Web Service"

### Variáveis de ambiente no Render

Se criou o banco PostgreSQL, adicione no Web Service:

```
DATABASE_URL=postgresql://user:password@host:5432/database
SPRING_PROFILES_ACTIVE=prod
```

O Render injeta automaticamente `PORT` - não precisa configurar.

## 🔧 Testando localmente

### Com Docker:

```bash
# Build
docker build -t projetos-app .

# Run com H2 (dados em /data)
docker run -p 8080:8080 -v projetos-data:/data projetos-app

# Run com PostgreSQL
docker run -p 8080:8080 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  projetos-app
```

### Sem Docker:

```bash
# Backend
cd Backend
./mvnw spring-boot:run

# Frontend (em outro terminal)
cd Frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📝 Checklist pós-deploy

- [ ] App abre no navegador
- [ ] CSS e imagens aparecem
- [ ] Consegue registrar usuário
- [ ] Login funciona
- [ ] Dados persistem após recarregar página
- [ ] Modelos são salvos e listados

## 🐛 Troubleshooting

### Frontend não aparece
- Verifique se o build do Docker completou sem erros
- Acesse `/h2-console` para ver se o backend está rodando
- Verifique logs do Render: Dashboard → seu serviço → Logs

### Dados não persistem
- **Com H2**: Normal em Render free tier (reinicia e perde dados)
- **Solução**: Use PostgreSQL gratuito do Render

### Erro 404 nas rotas do React
- Verifique se `WebConfig.java` foi incluído no build
- Confirme que `dist/` foi copiado para `static/`

### Erro de conexão com banco
- Verifique se `DATABASE_URL` está configurada corretamente
- Formato deve ser: `postgresql://user:pass@host:port/database`
- Render adiciona parâmetros extras, remova `?sslmode=require` se der erro

## 📦 Estrutura de arquivos importantes

```
/
├── Dockerfile              # Build multi-stage (Node + Maven + JRE)
├── start.sh               # Script de inicialização (detecta PostgreSQL)
├── render.yaml            # Configuração automática do Render
├── Backend/
│   ├── src/main/resources/
│   │   ├── application.properties          # Config local (H2)
│   │   ├── application-prod.properties     # Config produção
│   │   └── static/                         # Frontend build vai aqui
│   └── pom.xml            # Inclui H2 + PostgreSQL
└── Frontend/
    ├── dist/              # Gerado pelo Vite build
    └── src/
        ├── services/api.js    # API calls (usa proxy do Vite em dev)
        └── index.css          # Estilos globais
```

## 🎯 URLs importantes

- **Produção**: https://meu-projeto-final.onrender.com
- **Local**: http://localhost:8080
- **Frontend Dev**: http://localhost:5173
- **H2 Console** (apenas local): http://localhost:8080/h2-console

## 💡 Dicas

1. **Render free tier** hiberna após 15 min de inatividade - primeiro acesso pode demorar ~30s
2. **PostgreSQL free** tem limite de 1GB - suficiente para este projeto
3. **Logs do Render** são essenciais para debug - sempre verifique em caso de erro
4. **Build time** no Render: ~5-8 minutos (Node build + Maven build)
