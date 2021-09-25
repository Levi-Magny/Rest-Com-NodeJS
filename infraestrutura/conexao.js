const mysql = require('mysql');

/**
 * Criando um conexão com o banco de dados local
 */
const conexao = mysql.createConnection({
    host:'localhost',
    port: '3306',
    user: 'root',
    password: 'X9latvr5#k',
    database: 'agenda-petshop'
});

module.exports = conexao;