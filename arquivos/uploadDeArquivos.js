const fs = require('fs');
const path = require('path');

module.exports = (caminho, nomeArquivo, callbackImagemCriada) => {

    const tiposValidos = ['jpg', 'jpeg', 'png']; // define quais tipos de arquivos podem ser guardados no servidor
    const tipo = path.extname(caminho); // extrai o tipo do arquivo solicitado
    const tipo_e_valido = tiposValidos.indexOf(tipo.substring(1)) !== -1; // Verifica se o tipo e valido

    if(tipo_e_valido) {
        const novoCaminho = `./assets//imagens/${nomeArquivo}`;
        fs.ReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('finish', () => callbackImagemCriada(false, novoCaminho));
    } else {
        const erro = "Erro: Arquivo invalido!";
        callbackImagemCriada(erro);
    }

}