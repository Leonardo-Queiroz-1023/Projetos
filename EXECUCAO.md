# 🚀 Como Executar o Projeto

Este projeto é uma aplicação full-stack com **Backend Spring Boot** e **Frontend React + Vite**.

---

## 📋 Pré-requisitos

- **Java 17** ou superior
- **Node.js 16+** e npm
- **Maven** (incluído via wrapper: `mvnw`)

---

## ⚙️ Configuração do Backend

O backend usa:
- **Spring Boot 3.5.6**
- **H2 Database** (em memória)
- **Spring Data JPA**
- Porta: `8080`

### 1. Executar o Backend

```powershell
# Navegar para a pasta Backend
cd Backend

# Compilar e instalar dependências
.\mvnw clean install -DskipTests
# Executar a aplicação
.\mvnw spring-boot:run
```

O backend estará rodando em: **http://localhost:8080**

### 2. Acessar o Console H2 (Opcional - para Debug)

- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:projetosdb`
- Username: `sa`
- Password: *(deixar vazio)*

---

## 🎨 Configuração do Frontend

O frontend usa:
- **React 19**
- **Vite 7**
- **React Router DOM**
- Porta: `5173`

### 1. Instalar Dependências

```powershell
# Navegar para a pasta Frontend
cd Frontend

# Instalar dependências
npm install
```

### 2. Executar o Frontend

```powershell
# Modo desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

---

## 🔗 Integração Frontend-Backend

### Proxy Vite Configurado

O `vite.config.js` está configurado para fazer proxy das requisições:

```javascript
proxy: {
  '/auth': 'http://localhost:8080',
  '/modelos': 'http://localhost:8080',
  '/perguntas': 'http://localhost:8080',
}
```

Isso significa que:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Requisições do frontend são automaticamente redirecionadas para o backend

### CORS Configurado

Todos os controllers têm `@CrossOrigin(origins = "*")`, permitindo requisições de qualquer origem.

---

## 🗂️ Estrutura de Dados

### Entidades JPA

1. **Usuario** (ID: Long)
   - nome, email, senha, dataCadastro

2. **Modelo** (ID: UUID)
   - nome, descricao, plataformasDisponiveis
   - OneToMany → Perguntas

3. **Pergunta** (ID: UUID)
   - questao
   - ManyToOne → Modelo

### Endpoints API

#### Autenticação (`/auth`)
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

#### Modelos (`/modelos`)
- `GET /modelos/listar` - Listar todos
- `GET /modelos/{id}` - Buscar por ID (UUID)
- `POST /modelos/criar` - Criar modelo
- `PUT /modelos/atualizar/{id}` - Atualizar modelo
- `DELETE /modelos/deletar/{id}` - Deletar modelo

#### Perguntas (`/perguntas`)
- `GET /perguntas/listar/{modeloId}` - Listar perguntas do modelo
- `POST /perguntas/adicionar/{modeloId}` - Adicionar pergunta
- `PUT /perguntas/atualizar/{modeloId}/{perguntaId}` - Atualizar pergunta
- `DELETE /perguntas/remover/{modeloId}/{perguntaId}` - Remover pergunta

---

## 🧪 Testando a Integração

### 1. Executar Backend e Frontend

```powershell
# Terminal 1 - Backend
cd Backend
.\mvnw spring-boot:run

# Terminal 2 - Frontend (em outra janela)
cd Frontend
npm run dev
```

### 2. Acessar Aplicação

Abra o navegador em: **http://localhost:5173**

### 3. Fluxo de Teste

1. **Registrar usuário** em `/register`
2. **Fazer login** em `/login`
3. **Criar modelos** no menu central
4. **Adicionar perguntas** aos modelos
5. **Editar/Deletar** modelos e perguntas

---

## 📦 Build para Produção

### Frontend

```powershell
cd Frontend
npm run build
```

Os arquivos otimizados estarão em `Frontend/dist/`

### Backend

```powershell
cd Backend
.\mvnw clean package
```

O JAR estará em `Backend/target/Projetos-0.0.1-SNAPSHOT.jar`

Para executar:
```powershell
java -jar Backend/target/Projetos-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Solução de Problemas

### Erro de CORS
- Verifique se o backend está rodando na porta 8080
- Confirme que `@CrossOrigin(origins = "*")` está presente nos controllers

### Frontend não conecta ao backend
- Verifique se o proxy está configurado em `vite.config.js`
- Confirme que ambos os servidores estão rodando
- Limpe o cache do navegador

### Erro de compilação Java
- Verifique a versão do Java: `java -version` (deve ser 17+)
- Execute `.\mvnw clean install` novamente

### Erro npm
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

---

## 📝 Notas Importantes

- **Banco de dados H2** em memória: os dados são **perdidos** ao reiniciar o backend
- **IDs**: Modelos e Perguntas usam **UUID**, Usuários usam **Long**
- **Senhas**: Atualmente armazenadas em **texto plano** (implementar BCrypt no futuro)
- **Ambiente**: Configurado para desenvolvimento local apenas

---

## 🎯 Próximos Passos (Melhorias Futuras)

1. ✅ Implementar criptografia de senha (BCrypt)
2. ✅ Migrar para banco PostgreSQL/MySQL
3. ✅ Adicionar autenticação JWT
4. ✅ Implementar validações de formulário
5. ✅ Adicionar testes unitários
6. ✅ Deploy em produção (Render/Heroku)

---

**Desenvolvido com ❤️ usando Spring Boot + React**
