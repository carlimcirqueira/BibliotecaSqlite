const express = require('express');
const router = express.Router();
const db = require('../database');

// Cadastro de Usuario 
router.post('/', (req, res) => {
    const { nome, cpf, telefone, email } = req.body;

    // Validação simples de CPF utilizando Regex
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
        return res.status(400).json({ erro: "O CPF deve conter exatamente 11 dígitos numéricos." });
    }

    const sql = `INSERT INTO usuarios (nome, cpf, telefone, email) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nome, cpf, telefone, email], function(err) {
        if (err) {
            // Tratamento para CPF ou E-mail já existentes
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(409).json({ erro: "Conflito", mensagem: "CPF ou E-mail já cadastrado no sistema." });
            }
            return res.status(500).json({ erro: err.message });
        }
        res.status(201).json({ id: this.lastID, mensagem: "Usuário cadastrado com sucesso!" });
    });
});

// Listar por CPF -- Busca exata
router.get('/:cpf', (req, res) => {
    const { cpf } = req.params;

    // Usamos db.get pois o CPF é único, então esperamos apenas um resultado
    const sql = "SELECT * FROM usuarios WHERE cpf = ?";

    db.get(sql, [cpf], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (!row) {
            return res.status(404).json({ mensagem: "Usuário não encontrado para o CPF informado." });
        }

        res.json(row);
    });
});

// Apagar um usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM usuarios WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ erro: err.message });

        if (this.changes === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado para exclusão." });
        }

        res.json({ mensagem: "Usuário removido com sucesso." });
    });
});

module.exports = router;