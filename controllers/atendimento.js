const res = require('express/lib/response');
const Atendimento = require('../models/atendimentos');
/**
 * criando rotas para a API
 * @param {*} app app criado pelo express
 */
module.exports = app => {
    app.get('/atendimentos', (req) => {
        Atendimento.lista(res)
            .then(resultados => res.status(200).json(resultados))
            .catch(erros => res.status(400).json(erros));
    })

    app.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id); // para pegar os parametros da url
        Atendimento.buscaPorId(id, res);
    })

    app.post('/atendimentos', (req, res) => {
        const atendimento = req.body;
        Atendimento.adiciona(atendimento, res)
            .then(atendimentoCadastrado => res.status(201).json(atendimentoCadastrado)) // recebe o resultado da promise com os dados do atendimento cadastrado.
            .catch(erros => res.status(400).json(erros));
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