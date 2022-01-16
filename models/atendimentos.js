const conexao = require('../infraestrutura/database/conexao');
const moment = require('moment');// para manipulação de datas
const { json } = require('body-parser');
const { default: axios } = require('axios');// para consumir APIs
const repositorio = require('../repositorios/atendimento');

class Atendimento {

    constructor() {

        this.dataEValida = ({data, dataCriacao})  => moment(data).isSameOrAfter(dataCriacao); // verifica se a data e posterior ou atual
        this.clienteEValido = (tamanho) => tamanho >= 5;

        this.valida = parametros => this.validacoes.filter(campo => {
            const {nome} = campo;
            const parametro = parametros[nome];

            return !campo.valido(parametro);
        })

        this.validacoes = [ // criando objetos para mostrar os erros
            {
                nome: 'data',
                valido: this.dataEValida,
                mensagem: 'Data deve ser maior ou igual à atual.'
            },
            {
                nome: 'cliente',
                valido: this.clienteEValido,
                mensagem: 'Nome do cliente deve possuir 5 ou mais caracteres.'
            }
        ];
    }

    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'); // convertendo formato de data para o BD

        const parametros = {
            data: {data, dataCriacao},
            cliente: {tamanho: atendimento.cliente.length}
        }

        const erros = this.valida(parametros); // filtrando erros
        const existemErros = erros.length; // verificando se existem erros
        
        if(existemErros){ // se existirem erros, retorna os erros para o controller tratar
            return new Promise((resolve, reject) => reject(erros));
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data};// atualizao objeto de atendimentos
            
            return repositorio.adiciona(atendimentoDatado) // passando o resultado (dados) da promise para o controller
                .then((resultados) => {
                    const id = resultados.insertId;
                    return ({ ...atendimento, id});
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