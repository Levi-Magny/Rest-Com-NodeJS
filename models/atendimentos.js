const conexao = require('../infraestrutura/database/conexao');
const moment = require('moment');// para manipulação de datas
const { json } = require('body-parser');
const { default: axios } = require('axios');// para consumir APIs

class Atendimento {
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'); // convertendo formato de data para o BD
        
        const dataEValida = moment(data).isSameOrAfter(dataCriacao); // verifica se a data e posterior ou atual
        const clienteEValido = atendimento.cliente.length >= 5;
        
        const validacoes = [ // criando objetos para mostrar os erros
            {
                nome: 'data',
                valido: dataEValida,
                mensagem: 'Data deve ser maior ou igual à atual.'
            },
            {
                nome: 'cliente',
                valido: clienteEValido,
                mensagem: 'Nome do cliente deve possuir 5 ou mais caracteres.'
            }
        ];
        
        const erros = validacoes.filter(campo => !campo.valido); // filtrando erros
        const existemErros = erros.length; // verificando se existem erros
        
        if(existemErros){ // se existirem erros, retorna o objeto informativo e um header(400)
            res.status(400).json(erros);
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data};// atualizao objeto de atendimentos
            
            const sql = 'INSERT INTO Atendimentos SET ?'; //cria a query sql
            conexao.query(sql, atendimentoDatado, (erro, resultados) => { // executa a query SQL
                if (erro){
                    res.status(400).json(erro);
                } else {    
                    res.status(201).json(atendimento);
                }
            });
        }
    }

    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;
        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0];
            const cpf = atendimento.cliente;// pega o CPF salvo no BD
            if(erro){
                res.status(400).json(erro);
            } else {
                const {data} = await axios.get(`http://localhost:8082/${cpf}`); // consumindo API com Axios para obter informacoes do cliente
                atendimento.cliente = data;
                res.status(200).json(atendimento);
            }
        })
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados)
            }
        })
    }

    altera(id, valores, res){
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else {
                res.status(200).json({...valores, id});
            }
        })
    }

    deleta(id, res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?';

        conexao.query(sql, id, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }
        })
    }
}

module.exports = new Atendimento;