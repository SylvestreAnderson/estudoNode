const chalk = require('chalk')

const nota = 5

if(nota >= 7){
    console.log(chalk.green.bold('Parabens! Você está aprovado!'))
} else {
    console.log(chalk.red.bold('Voce precisa fazer a prova de recuperação!'))
}

