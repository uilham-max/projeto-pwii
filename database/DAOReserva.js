const Reserva = require('../model/Reserva.js')
const Reboque = require('../model/Reboque.js')
const Cliente = require('../model/Cliente.js')
const { Op, Sequelize } = require('sequelize')


class DAOReserva {

    // INSERT
    static async insert(dataSaida, dataChegada, valorDiaria, diarias, valorTotal, cliente, reboque) {
        try {
            await Reserva.create({ dataSaida: dataSaida, dataChegada: dataChegada, valorDiaria: valorDiaria, diarias: diarias, valorTotal: valorTotal, clienteId: cliente, reboqueId: reboque })
            return true
        }
        catch (error) {
            console.log(error.toString())
            return false
        }
    }

    // READ
    static async getAll() {

        try {
            const currentDate = new Date()
            const reservas = await Reserva.findAll({
                where: {
                    [Op.or]: [
                        { dataSaida: { [Op.gte]: currentDate } },
                        { dataChegada: { [Op.gte]: currentDate } }
                    ],
                },
                order: ['id'],
                include: [{ model: Reboque }, { model: Cliente }]
            })
            return reservas
        }
        catch (error) {
            console.log(error.toString())
            return undefined
        }
    }

    // GETONE
    static async getOne(id) {
        try {
            let reserva = await Reserva.findByPk(id)
            return reserva
        }
        catch (error) {
            console.log(error.toString())
            return undefined
        }
    }

    // DELETE
    static async delete(id) {
        try {
            await Reserva.destroy({ where: { id: id } })
            return true
        }
        catch (error) {
            console.log(error.toString())
            return false
        }
    }

    // UPDATE
    static async update(id, dataSaida, dataChegada, valorDiaria, cliente, reboque){
        try{
            await Reserva.update({dataSaida: dataSaida, dataChegada: dataChegada, valorDiaria: valorDiaria, clienteId: cliente, reboqueId: reboque}, {where: {id: id}})
            return true
        }
        catch(error){
            console.log(error.toString());
            return false
        }
    }

    /**METODOS ENCARREGADOS PELA PARTE DOS RELATORIOS */

    // RELATORIO HISTORICO
    static async getRelatorioHistorico(dataInicio, dataFim) {
        try {
            let reservas = await Reserva.findAll({
                where:{
                    dataSaida: {[Op.between]: [dataInicio, dataFim]}},    
                order: ['id'], 
                include: [{ model: Reboque }, {model: Cliente}]
            })
            return reservas
        }
        catch (error) {
            console.log(error.toString())
            return undefined
        }
    }


    // RELATORIO LUCRO
    static async getRelatorioLucro(dataInicio, dataFim){
        try{
            let reboques = await Reserva.findAll({
                attributes: ['reboqueId', [Sequelize.fn('SUM', Sequelize.col('valorTotal')), 'valorTotal']],
                where: {dataSaida: {[Op.between]: [dataInicio, dataFim]}},
                group: ['reboque.id', 'reserva.reboqueId'],
                include: [{model: Reboque}]
            })
            return reboques
        }
        catch(error){
            console.log(error.toString())
            return undefined
        }
    }


}

module.exports = DAOReserva