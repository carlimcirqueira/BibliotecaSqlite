const express = require('express');
const router = express.Router();
const db = require('../database');

// Cadastra emprestimo
router.post('/', (req, res) => {
    const { id_livro, id_usuario, data_emprestimo, data_vencimento, status } = req.body;

    const sql = `INSERT INTO emprestimos (id_livro, id_usuario, data_emprestimo, data_vencimento, status) 
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [id_livro, id_usuario, data_emprestimo, data_vencimento, status], function(err) {
        if (err) {
            // Se o ID do livro ou usuário não existir, o SQLite lançará este erro
            if (err.message.includes("FOREIGN KEY constraint failed")) {
                return res.status(400).json({ erro: "Livro ou Usuário não encontrado." });
            }
            return res.status(500).json({ erro: err.message });
        }
        res.status(201).json({ id: this.lastID, mensagem: "Empréstimo registrado!" });
    });
});

// Listar todos
router.get('/', (req, res) => {
    // Como o formato é DD-MM-AAAA, a ordenação textual simples pode não ser perfeita
    const sql = "SELECT * FROM emprestimos ORDER BY data_emprestimo DESC";

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Listar por usuario
router.get('/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const sql = "SELECT * FROM emprestimos WHERE id_usuario = ?";

    db.all(sql, [id_usuario], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Listar por status
router.get('/status/:status', (req, res) => {
    const { status } = req.params;
    const sql = "SELECT * FROM emprestimos WHERE status = ?";

    db.all(sql, [status], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Atualizar por id um emprestimo
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data_vencimento, status } = req.body;

    const sql = `UPDATE emprestimos SET data_vencimento = ?, status = ? WHERE id = ?`;

    db.run(sql, [data_vencimento, status, id], function(err) {
        if (err) return res.status(400).json({ erro: err.message });
        
        if (this.changes === 0) {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }
        res.json({ mensagem: "Empréstimo atualizado com sucesso!" });
    });
});

module.exports = router;