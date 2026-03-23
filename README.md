# API REST de Filmes

## Descrição do Projeto

Esta é uma API REST desenvolvida com **Node.js** e **Express**, com o objetivo de demonstrar na prática como funciona um CRUD completo (Create, Read, Update, Delete).

A API permite gerenciar uma lista de filmes armazenados **em memória**, ou seja, os dados não são persistidos em banco de dados e são reiniciados sempre que o servidor é desligado.

---

## Funcionalidades

* Listar filmes com filtros, ordenação e paginação
* Buscar filme por ID
* Criar novos filmes
* Atualizar filmes existentes
* Remover filmes
* Endpoints informativos

---

## Como executar o projeto

1. Instale o Express:

```bash
npm install express
```

2. Execute o servidor:

```bash
node index.js
```

3. Acesse:

```
http://localhost:3000
```

---

## Endpoints da API

### - GET `/`

Retorna uma mensagem indicando que a API está funcionando.

---

### - GET `/dados`

Retorna informações gerais da API:

* Nome
* Versão
* Autor
* Descrição

---

### - GET `/info`

Endpoint simples de teste.

---

### - GET `/api/filmes`

Lista todos os filmes com funcionalidades avançadas:

#### Filtros:

* `categoria`
* `arrecadacao_min`
* `arrecadacao_max`

#### Ordenação:

* `ordem`: `nome` ou `arrecadacao`
* `direcao`: `asc` ou `desc`

#### Paginação:

* `pagina`
* `limite`

**Exemplo de uso: Body**
```json
{
    nome: "Rei Leão", 
    arrecadacao: 1.663, 
    categoria: "Livre L", 
    duracao:89
}
```
```
/api/filmes?ordem=arrecadacao
```
