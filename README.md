# 📖 Cloud Library

![Status do Projeto](https://img.shields.io/badge/status-em--desenvolvimento-yellow?style=for-the-badge)
![GitHub Last Commit](https://img.shields.io/github/last-commit/NickDallAgnol/ADS_NicholasDallAgnol_CloudLibrary?style=for-the-badge)
![GitHub Repo Size](https://img.shields.io/github/repo-size/NickDallAgnol/ADS_NicholasDallAgnol_CloudLibrary?style=for-the-badge)

<p align="center">
  <img src="https://raw.githubusercontent.com/NickDallAgnol/ADS_NicholasDallAgnol_CloudLibrary/main/repo-assets/cloud-library-logo.png?token=GHSAT0AAAAAACQ4Z77BVYV7A6Q37W7L7C6GZR45GNA" alt="Cloud Library Logo" width="200"/>
</p>

**Cloud Library** é uma plataforma moderna para gestão de acervos pessoais de livros. Desenvolvido como um projeto acadêmico, o sistema permite que leitores organizem suas coleções de forma digital, intuitiva e eficiente.

---

## ✨ Features Principais

-   **👤 Autenticação Segura:** Cadastro e login de usuários com senhas criptografadas e autenticação via JWT.
-   **📚 Gerenciamento de Livros:** CRUD completo para livros, com detalhes como status de leitura e percentual lido.
-   **✍️ Cadastros de Apoio:** Gerenciamento de Autores, Editoras e Gêneros para uma organização detalhada do acervo.
-   **🤝 Gestão de Empréstimos:** Controle de livros emprestados, com registro de mutuários e datas de devolução.
-   **📄 Exportação de Dados:** Funcionalidade para exportar o acervo em formatos PDF e CSV.
-   **📱 Progressive Web App (PWA):** Instale a aplicação no seu dispositivo para uma experiência nativa e acesso offline.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando uma arquitetura moderna e escalável, separando o backend do frontend em um monorepo.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

| Categoria      | Tecnologia                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **Frontend** | `React`, `Vite`, `TypeScript`, `Tailwind CSS`, `React Router`                |
| **Backend** | `NestJS`, `TypeScript`, `TypeORM`, `PostgreSQL`                              |
| **Segurança** | `JWT (JSON Web Token)`, `bcrypt`                                           |
| **Ferramentas**| `Git & GitHub`, `Swagger (OpenAPI)`, `PDFMake`, `CSV-Writer`                 |

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### **Pré-requisitos**

-   [Node.js](https://nodejs.org/) (v18+)
-   [Yarn](https://yarnpkg.com/) ou [NPM](https://www.npmjs.com/)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Git](https://git-scm.com/)

### **Passos para Instalação**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/NickDallAgnol/ADS_NicholasDallAgnol_CloudLibrary.git](https://github.com/NickDallAgnol/ADS_NicholasDallAgnol_CloudLibrary.git)
    cd ADS_NicholasDallAgnol_CloudLibrary
    ```

2.  **Configurar o Backend (API):**
    ```bash
    # Navegue para a pasta da API
    cd api

    # Instale as dependências
    npm install

    # Crie o arquivo de variáveis de ambiente
    # (No Windows, use 'copy' em vez de 'cp')
    cp .env.example .env

    # Preencha o arquivo .env com suas credenciais do PostgreSQL
    # Ex: DB_HOST=localhost, DB_PORT=5432, etc.

    # Rode a API em modo de desenvolvimento
    npm run start:dev
    ```
    ✅ A API estará rodando em `http://localhost:3000`.

3.  **Configurar o Frontend (Web):**
    ```bash
    # Em um NOVO terminal, navegue para a pasta do frontend
    cd web

    # Instale as dependências
    npm install

    # Rode a aplicação
    npm run dev
    ```
    ✅ O frontend estará acessível em `http://localhost:5173`.

---

## 📝 Documentação da API

A documentação completa dos endpoints da API está disponível via Swagger. Com a API rodando, acesse:

**[http://localhost:3000/api](http://localhost:3000/api)**

---

## 📂 Estrutura de Pastas

O projeto está organizado em um monorepo para facilitar o desenvolvimento e a manutenção.