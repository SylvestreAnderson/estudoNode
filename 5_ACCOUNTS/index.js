// modulos externos
const chalk = require("chalk")
const inquirer = require("inquirer")
// modulos internos
const fs = require("fs")
const { get } = require("https")

operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer',
        choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    },
  ]).then((answer) => {
    const action = answer['action']

        switch (action){
            case "Criar conta":
                createAccount();
                break;
            case "Consultar Saldo":
                getAccountBalance();
                break;
            case "Depositar":
                deposito();
                break;
            case "Sacar":
                withdraw()
                break;
            case "Sair":
               console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!')) 
               process.exit()
               break;
            default:
                console.log("Erro de conta")
                break;   
        }
        
  }).catch(err => console.log(err))
}

//Create an account
function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua contaa seguir'))
    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
            
            )
            buildAccount()
            return
        }

        fs.writeFileSync(
            `accounts/${accountName}.json`, 
            '{"balance": 0}',
            function(err){
                console.log(err)
            },        
        )
        console.log(chalk.green('Parabéns, sua conta foi criada!'))
       operation()
    }).catch(err => console.log(err))
}

//Criação do deposito
function deposito(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
  ]).then((answer) => {
    const accountName = answer['accountName']

    // verificar se a conta existe
    if (!checkAccount(accountName)){
        return deposito()
    }

    inquirer.prompt([{
        name: 'amout',
        message: 'Quanto você deseja depositar',
    }]).then((answer) =>{
        const amout = answer['amout']

        // add an amount
        addAmount(accountName, amout)
        
    }).catch(err => console.log(err))

  }).catch(err => console.log(err))
}

// Validar conta

function checkAccount(accountName){

    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outra nome'))
        return false
    }

    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposito()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) 

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))

    operation()
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}

//showaccount balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]

        //verify if account exists

        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData1 = getAccount(accountName)

        console.log(chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de R$${accountData1.balance}`
         ),
        )
        operation()

        const accountData = getAccount(accountName)

    }).catch(err => console.log(err))
}


// withdraw an amount from user account
function withdraw(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answer) => {
            
            const amount = answer['amount']

            removeAmount(accountName, amount)
            

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))

}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(
            chalk.bgRedBright.black('Ocorreu um erro, tente novamente mais tarde!'),
        )
        return withdraw()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )

    console.log(`Foi realizado um saque de R$${amount} da sua conta!`)

    operation()
}