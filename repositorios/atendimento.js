const query = require('../infraestrutura/database/queries');

class Atendimento {
    adiciona(atendimento){
        const sql = 'INSERT INTO Atendimentos SET ?'; //cria a query sql
        return query(sql, atendimento); //passando a promise de volta para o model
    }
}

module.exports = new Atendimento();