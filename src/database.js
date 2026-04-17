const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

db.serialize(() => {
    // Ativar suporte a Chaves Estrangeiras para a tabela Emprestimos
    db.run("PRAGMA foreign_keys = ON;");
    // O Check é utilizado para "Checar" o formato do texto passado
    //Criação da tabela de Livros
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        autores TEXT NOT NULL,
        data_publicacao TEXT NOT NULL,
        qtd_paginas INTEGER NOT NULL,
        num_edicao INTEGER NOT NULL,
        categoria TEXT CHECK(categoria IN ('ACADEMICO', 'INFANTIL', 'LITERATURA', 'AUTOBIOGRAFIA')),
        status TEXT CHECK(status IN ('DISPONIVEL', 'INDISPONIVEL')),
        CHECK (data_publicacao LIKE '__-__-____')
    )`);

    //Criação da tabela de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL,
        CHECK (cpf LIKE '___________')
    )`);
    
    //Criação da tabela de emprestimos
    db.run(`CREATE TABLE IF NOT EXISTS emprestimos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_livro INTERGER NOT NULL,
        id_usuario INTERGER NOT NULL,
        data_emprestimo TEXT NOT NULL,
        data_vencimento TEXT NOT NULL,
        status TEXT CHECK(status IN ('ATIVO', 'ATRASADO', 'CONCLUIDO')),
        FOREIGN KEY (id_livro) REFERENCES livros (id) ON DELETE CASCADE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE
        CHECK (data_emprestimo LIKE '__-__-____' and data_vencimento LIKE '__-__-____')
    )`);

});

module.exports = db;