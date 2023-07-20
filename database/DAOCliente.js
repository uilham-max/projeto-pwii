const Cliente = require('../model/Cliente.js')


class DAOCliente{

    static async insert(nome, cpf, telefone, logradouro){
        // console.log(nome)
        try{
            await Cliente.create({nome, cpf, telefone, logradouro})
            return true
        }
        catch(erro){
            console.log(erro.toString())
            return false
        }
    }

    static async update(id, nome, cpf, telefone, logradouro){
        try{
            await Cliente.update({nome: nome, cpf: cpf, telefone: telefone, logradouro: logradouro},{where: {id: id}})
            return true
        }
        catch(error){
            console.log(error.toString())
            return false
        }
    }

    static async delete(id){
        try{
            await Cliente.destroy({where: {id: id}})
            return true
        }
        catch(error){
            console.log(error.toString())
            return false
        }
    }

    static async getOne(id){
        try{
            let cliente = await Cliente.findByPk(id)
            return cliente
        }
        catch(error){
            console.log(error.toString())
            return undefined
        }
    }

    static async getAll(){
        try{
            let clientes = await Cliente.findAll({order: ['nome']})
            return clientes
        }
        catch(error){
            console.log(error.toString())
            return undefined
        }
    }

}


module.exports = DAOCliente