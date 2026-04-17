const express = require('express');
const app = express();

// Importação das rotas de livros,usuarios e emprestimos
const rotaLivros = require('./src/routes/livros');
//const rotaUsuarios = require('./src/routes/usuarios');
//const rotaEmprestimos = require('./src/routes/emprestimos');

app.use(express.json());

// Definição dos prefixos das rotas
app.use('/livros', rotaLivros);
//app.use('/usuarios', rotaUsuarios);
//app.use('/emprestimos', rotaEmprestimos);

//Rodando o Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Biblioteca rodando em http://localhost:${PORT}`);
});