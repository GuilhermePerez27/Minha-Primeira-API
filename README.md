# API REST de Filmes

## Descrição do Projeto

Esta é uma API REST desenvolvida com **Node.js**, **Express** e **SQLite**, com o objetivo de demonstrar na prática como funciona um CRUD completo (Create, Read, Update, Delete) com autenticação.

A API permite gerenciar uma lista de filmes e usuários, com dados armazenados em banco de dados SQLite.

Além disso, conta com autenticação utilizando **JWT (JSON Web Token)** para proteger rotas sensíveis.

---

## Funcionalidades

* Listar filmes com paginação e filtros
* Buscar filme por ID
* Criar novos filmes (rota protegida)
* Atualizar filmes existentes
* Remover filmes
* Criar usuários
* Relacionar filmes com usuários
* Autenticação com JWT
* Endpoints informativos

---

## Tecnologias utilizadas

* Node.js
* Express
* SQLite
* JSON Web Token (JWT)

---

## Como executar o projeto

1. Instale as dependências:

```bash
npm install express sqlite3 jsonwebtoken
```

2. Execute o servidor:

```bash
node index.js
```

3. Acesse no navegador:

```
http://localhost:3000
```

---

## Autenticação

A API utiliza JWT para proteger rotas.

### POST `/login`

Gera um token de autenticação.

**Body:**

```json
{
  "email": "teste@email.com"
}
```

**Resposta:**

```json
{
  "token": "SEU_TOKEN_AQUI"
}
```

Utilize o token nas rotas protegidas:

```
Authorization: Bearer SEU_TOKEN
```

---

## Endpoints da API

### GET `/`

Retorna uma mensagem indicando que a API está funcionando.

---

### GET `/info`

Retorna informações da API:

* Nome
* Versão
* Autor

---

## Usuários

### POST `/api/usuarios`

Cria um novo usuário.

**Body:**

```json
{
  "nome": "Guilherme",
  "email": "gui@email.com"
}
```

---

## Filmes

### GET `/api/filmes`

Lista filmes com paginação e filtro.

**Query Params:**

* `arrecadacao_max`
* `page` (padrão: 1)

**Exemplo:**

```
/api/filmes?page=1
```

---

### GET `/api/filmes/:id`

Busca um filme pelo ID.

---

### GET `/api/filmes-com-usuario`

Retorna filmes com o nome do usuário associado (JOIN).

---

### POST `/api/filmes`

Cria um novo filme (rota protegida).

**Headers:**

```
Authorization: Bearer SEU_TOKEN
```

**Body:**

```json
{
  "nome": "Vingadores",
  "arrecadacao": 2.8,
  "categoria": "12 anos",
  "duracao": 180,
  "usuario_id": 1
}
```

---

### PUT `/api/filmes/:id`

Atualiza um filme existente.

**Body:**

```json
{
  "nome": "Vingadores Atualizado",
  "arrecadacao": 3.0,
  "categoria": "12 anos",
  "duracao": 190
}
```

---

### DELETE `/api/filmes/:id`

Remove um filme pelo ID.

---

## Estrutura do Banco de Dados

### Tabela: usuarios

| Campo | Tipo    |
| ----- | ------- |
| id    | INTEGER |
| nome  | TEXT    |
| email | TEXT    |

---

### Tabela: filmes

| Campo       | Tipo    |
| ----------- | ------- |
| id          | INTEGER |
| nome        | VARCHAR |
| arrecadacao | DECIMAL |
| categoria   | VARCHAR |
| duracao     | DECIMAL |
| usuario_id  | INTEGER |

---

## Testes

Você pode testar a API utilizando ferramentas como:

* Postman
* Insomnia

---

## Observações

* O banco de dados é criado automaticamente ao iniciar o projeto
* A tabela `filmes` possui relacionamento com `usuarios`
* Algumas rotas exigem autenticação via JWT
* Caso o banco esteja desatualizado, apague o arquivo `test.db` e reinicie o servidor

---

## Autor

Guilherme Perez
