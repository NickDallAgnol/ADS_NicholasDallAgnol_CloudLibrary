# 🔌 Cloud Library API

API REST desenvolvida com **NestJS** e **TypeScript** para gerenciamento de acervos pessoais de livros.

## 📋 Sobre

Backend da aplicação Cloud Library, responsável por:
- Autenticação e autorização de usuários
- Gerenciamento de livros (CRUD completo)
- Sistema de empréstimos entre usuários
- Exportação de dados em PDF e CSV
- Validação de dados e segurança

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Criptografia de senhas
- **Swagger** - Documentação da API

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na raiz da pasta /api
cp .env.example .env
```

## ⚙️ Configuração do Banco de Dados

Configure as variáveis no arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=cloudlibrary_db

JWT_SECRET=sua_chave_secreta_aqui
```

## 🏃 Executar a Aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

## 📚 Documentação

Acesse a documentação interativa Swagger em:

```
http://localhost:3000/api
```

## 🏗️ Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação
│   ├── guards/     # Guards de proteção JWT
│   ├── strategy/   # Estratégia de validação JWT
│   └── dto/        # Data Transfer Objects
├── books/          # Módulo de livros
│   ├── entities/   # Entidades do banco
│   ├── dto/        # Validações de entrada
│   └── *.service.ts # Lógica de negócio
├── loans/          # Módulo de empréstimos
├── users/          # Módulo de usuários
└── main.ts         # Arquivo principal
```

## 🔒 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação:

1. Registre-se ou faça login em `/auth/register` ou `/auth/login`
2. Receba o token de acesso
3. Inclua o token no header: `Authorization: Bearer {token}`

## 📋 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Fazer login |
| GET | `/auth/me` | Dados do usuário autenticado |
| GET | `/books` | Listar livros |
| POST | `/books` | Criar livro |
| GET | `/books/stats/overview` | Estatísticas de leitura |
| GET | `/books/export/pdf` | Exportar acervo em PDF |
| GET | `/loans` | Listar empréstimos |
| POST | `/loans` | Criar empréstimo |

## 🔧 Validações

A API utiliza **class-validator** para validação automática de DTOs:
- Emails devem ser de provedores válidos
- Senhas devem ter no mínimo 6 caracteres
- Campos obrigatórios são validados automaticamente

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
