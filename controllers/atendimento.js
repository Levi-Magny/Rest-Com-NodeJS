const Atendimento = require('../models/atendimentos');
/**
 * criando rotas para a API
 * @param {*} app app criado pelo express
 */
module.exports = app => {
    app.get('/atendimentos', (req, res) => {
        Atendimento.lista(res);
    })

    app.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id); // para pegar os parametros da url
        Atendimento.buscaPorId(id, res);
    })

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body;
        Atendimento.adiciona(atendimento, res);
        // res.send('Você está na rota de atendimentos e está realizando um POST')
    })

    app.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;

        Atendimento.altera(id, valores, res);
    })

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);

        Atendimento.deleta(id, res);
    })
}