# Fake API com JSON Server

Este repositório contém a implementação de uma fake API utilizando JSON Server, JSON Server Auth e Multer. Esta API simula operações CRUD em usuários e produtos, além de permitir upload de imagens.

## Objetivo

A API foi desenvolvida com o objetivo de:
- Proporcionar um backend simulado para desenvolvimento e testes de aplicações frontend.
- Implementar operações CRUD (Create, Read, Update, Delete) para usuários e produtos.
- Gerenciar uploads de imagens para produtos e usuários.

## Tecnologias Utilizadas

As principais tecnologias utilizadas neste projeto são:

- [JSON Server](https://www.npmjs.com/package/json-server): Um servidor de API REST fake para desenvolvimento e prototipagem.
- [JSON Server Auth](https://www.npmjs.com/package/json-server-auth): Middleware para adicionar autenticação ao JSON Server.
- [Multer](https://www.npmjs.com/package/multer): Middleware para manipulação de multipart/form-data, utilizado para upload de arquivos.
- [Node.js](https://nodejs.org/): Ambiente de execução JavaScript server-side.


## Endpoints

### Autenticação

As rotas são protegidas com JSON Server Auth, seguindo as seguintes regras:
- `users`: acessível apenas para usuários autenticados.
- `products`: acessível apenas para usuários autenticados.

### Usuários

- `POST /users`: Cria um novo usuário.
- `PATCH /users/:id`: Atualiza as informações de um usuário existente.

### Produtos

- `POST /products`: Cria um novo produto.
- `PUT /products/:id`: Atualiza as informações de um produto existente.

## Upload de Imagens

A API permite o upload de imagens para produtos e usuários. As imagens são armazenadas no diretório `public/images`.

## Validações

As rotas de criação e atualização de usuários e produtos possuem validações:

- **Usuários**:
  - Nome deve ter mais que 2 caracteres.
  - Email deve ser válido.
  - Senha deve ter mais que 6 caracteres.

- **Produtos**:
  - Nome deve ter mais que 2 caracteres.
  - Preço deve ser um número positivo.
  - Descrição deve ter mais que 10 caracteres.

## Erros

Caso ocorra algum erro de validação, a API retorna um objeto JSON com os detalhes do erro e status code 400. Se um arquivo de imagem foi enviado e ocorre um erro de validação, o arquivo é deletado do servidor.

## Repositório do projeto em React

- [Frontend em React](https://github.com/thiagojorgelins/frontend-react-atv8): Projeto em React que utilizou esta API
