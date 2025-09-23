** Cloud Library 📚

** Sobre o Projeto

[cite_start]Cloud Library é um sistema de gestão de acervo pessoal de livros, desenvolvido como projeto para a disciplina de ADS na Universidade de Passo Fundo (UPF)[cite: 1]. [cite_start]O objetivo é permitir que leitores organizem sua coleção de forma digital, cadastrando livros, autores, editoras e gêneros, além de registrar empréstimos e acompanhar o progresso de leitura[cite: 37, 38, 40].

---

##Tecnologias Utilizadas

[cite_start]O projeto foi construído com uma arquitetura moderna, utilizando as seguintes tecnologias[cite: 159]:

* **Frontend (Web):** React com Vite, TypeScript e Tailwind CSS
* **Backend (API):** NestJS com TypeScript
* **Banco de Dados:** PostgreSQL
* **ORM:** TypeORM
* **Autenticação:** JWT (JSON Web Token) e bcrypt

---

##Como Rodar o Projeto

Para executar o projeto localmente, siga os passos abaixo.

**Pré-requisitos**

* Node.js (v18+)
* PostgreSQL
* Git

**Instalação**

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

    # Crie um arquivo .env a partir do .env.example (você precisará criar este)
    # e preencha com suas credenciais do PostgreSQL
    
    # Rode a API em modo de desenvolvimento
    npm run start:dev
    ```
    A API estará rodando em `http://localhost:3000`.

3.  **Configurar o Frontend (Web):**
    ```bash
    # Em um novo terminal, navegue para a pasta do frontend
    cd web

    # Instale as dependências
    npm install

    # Rode a aplicação
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173`.

---

** Autor

* [cite_start]**Nicholas Dall Agnol** - [198950@upf.br](mailto:198950@upf.br) [cite: 50]