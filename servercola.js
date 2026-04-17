const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 1. Middlewares
// O App.jsx exige CORS habilitado para não bloquear as requisições.
app.use(cors());
// Necessário para o Express entender o JSON enviado pelo fetch do React.
app.use(express.json());

// 2. Banco de Dados (Em memória para a atividade)
// Iniciamos com um exemplo para o "Buscar todos" já retornar algo.
let livros = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", descricao: "Código limpo", num_paginas: 464 }
];

// 3. Rotas (Contexto: Biblioteca)

// GET: Listar todos (Desafio: readAll)
app.get('/livros', (req, res) => {
  res.json(livros);
});

// GET: Buscar por ID (Desafio: readById)
app.get('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const livro = livros.find(l => l.id === id);

  if (!livro) {
    return res.status(404).json({ error: "Livro não encontrado" });
  }
  res.json(livro);
});

// POST: Cadastrar (Desafio: create)
app.post('/livros', (req, res) => {
  const { titulo, autor, descricao, num_paginas } = req.body;

  const novoLivro = {
    id: livros.length > 0 ? livros[livros.length - 1].id + 1 : 1,
    titulo,
    autor,
    descricao,
    num_paginas: Number(num_paginas)
  };

  livros.push(novoLivro);
  res.status(201).json(novoLivro);
});

// PUT: Editar (Desafio: update)
app.put('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = livros.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registro não encontrado" });
  }

  livros[index] = { ...livros[index], ...req.body, id };
  res.json(livros[index]);
});

// DELETE: Excluir (Desafio: delete)
app.delete('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  livros = livros.filter(l => l.id !== id);
  res.status(204).send();
});


let produtos = [
  { id: 1, Nome: "Maca", Preco: 12.00, Quantidade: 10 }
];

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ error: "Produto não encontrado" });
  }
  return res.json(produto);
});

app.post('/produtos', (req, res) => {
  const {nome, preco, quantidade} = req.body;
  const novoProduto = {
    id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco,
    quantidade
  };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// 4. Inicialização
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
