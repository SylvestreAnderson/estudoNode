const fs = require("fs")

if(!fs.existsSync('./minhapasta')) {
    console.log('Não existem')
    fs.mkdirSync("minhapasta")
} else if(fs.existsSync('./minhapasta')) {
    console.log('Existem')
}



