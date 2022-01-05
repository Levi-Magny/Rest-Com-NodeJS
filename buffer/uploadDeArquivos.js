const fs = require('fs');

fs.readFile('./assets/Bili.jpg', (erro, buffer) => {
    console.log("jogamos a imagem no buffer!\n");
    fs.writeFile('./assets/Bili02.jpg', buffer, (erro) => {
        console.log('imagem foi escrita.');
    })
})