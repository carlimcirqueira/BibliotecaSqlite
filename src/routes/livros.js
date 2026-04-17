const express = require('express');
const router = express.Router(); // Importação do router para fazer funcionar a separação de rotas
const db = require('../database'); // Importa a conexão

// Listagem dos livros
router.get('/', (req, res) => {
    db.all("SELECT * FROM livros", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro interno no servidor' });
        res.json(rows);
    });
});

// Cadastro do livro no banco de dados
router.post('/', (req, res) => {
    const { nome, autores, data_publicacao, qtd_paginas, num_edicao, categoria, status } = req.body;
    const sql = `INSERT INTO livros (nome, autores, data_publicacao, qtd_paginas, num_edicao, categoria, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [nome, autores, data_publicacao, qtd_paginas, num_edicao, categoria, status], function(err) {
        if (err) return res.status(400).json({ error: 'Falha cliente, dados passados incorretos'});
        res.status(201).json({ id: this.lastID , mensagem: "Livro criado com sucesso"});
    });
});

// Busca por NOME, Aqui é utilizado LIKE para fazer a busca parcial
router.get('/busca', (req, res) => {
    const { nome } = req.query;
    db.all("SELECT * FROM livros WHERE nome LIKE ?", [`%${nome}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro interno no servidor' });
        res.json(rows);
    });
});

//Atualização do livro pelo id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, autores, data_publicacao, qtd_paginas, num_edicao, categoria, status } = req.body;

    const sql = `UPDATE livros SET 
                 nome = ?, autores = ?, data_publicacao = ?, 
                 qtd_paginas = ?, num_edicao = ?, categoria = ?, status = ? 
                 WHERE id = ?`;

    db.run(sql, [nome, autores, data_publicacao, qtd_paginas, num_edicao, categoria, status, id], function(err) {
        if (err) return res.status(400).json({ erro: "Erro ao atualizar", detalhes: err.message }); //Retorna mensagem de erro
        
        // Verifica se o ID realmente existia no banco
        if (this.changes === 0) {
            return res.status(404).json({ mensagem: "Livro não encontrado para atualização." });
        }
        
        res.json({ mensagem: "Livro atualizado com sucesso!" });
    });
});

//Delecao do livro por id
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM livros WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ erro: err.message });

        if (this.changes === 0) {
            return res.status(404).json({ mensagem: "Não foi possível apagar: livro não encontrado." });
        }

        res.json({ mensagem: "Livro excluído com sucesso do sistema." });
    });
});

// Buscar copias por nome e edição
router.get('/quantidade/copias', (req, res) => {
    // SQL: Seleciona o nome, edição e conta quantos registros existem para cada grupo
    const sql = `
        SELECT nome, num_edicao, COUNT(*) as quantidade_copias 
        FROM livros 
        GROUP BY nome, num_edicao
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        res.json({
            descricao: "Quantidade de exemplares agrupados por título e edição",
            dados: rows
        });
    });
});

module.exports = router;