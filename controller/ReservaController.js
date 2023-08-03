const express = require('express')
const routerReserva = express.Router()
const DAOReserva = require('../database/DAOReserva')
const DAOCliente = require('../database/DAOCliente')
const DAOReboque = require('../database/DAOReboque')
const autorizacao = require('../autorizacao/autorizacao')



// CRIAR GET
routerReserva.get('/reserva/novo/:mensagem?', autorizacao, (req, res) => {
    DAOReboque.getAll().then(reboques => {
        DAOCliente.getAll().then(clientes => {
            if(req.params.mensagem){ 
                res.render('reserva/novo', {mensagem: "Reserva incluída.", reboques: reboques, clientes: clientes})
            } else {
                if(reboques.length != 0 && clientes.length != 0){
                    res.render('reserva/novo', {mensagem: "", reboques: reboques, clientes: clientes})
                } else {
                    res.render('erro', {mensagem: "Lista de reboques ou clientes vazia."})
                }
            } 
        })
    })
})

// CRIAR POST
routerReserva.post('/reserva/salvar', autorizacao, (req, res) => {
    let {dataSaida, dataChegada, valorDiaria, cliente, reboque } = req.body
    DAOReserva.insert(dataSaida, dataChegada, valorDiaria, cliente, reboque).then(inserido => {
        DAOReboque.getAll().then(reboques => {
            DAOCliente.getAll().then(clientes => {
                if (inserido) {
                    res.render('reserva/novo', { mensagem: "Reserva inserido", reboques: reboques, clientes: clientes })
                }
                else {
                    res.render('erro', { mensagem: "Erro ao inserir a reserva." })
                }
            })
        })
    })
})


// DELETAR 
routerReserva.get('/reserva/excluir/:id', autorizacao, (req, res) => {
    let id = req.params.id
    DAOReserva.delete(id).then(excluido =>{
        if(excluido){
            res.redirect('/reserva/lista')
        } else {
            res.render('erro', {mensagem: "Erro ao excluir"})
        }
    })
})

// ATUALIZAR GET
routerReserva.get('/reserva/editar/:id', autorizacao, (req, res) => {
    let id = req.params.id
    DAOReserva.getOne(id).then(reserva => {
        DAOReboque.getAll().then(reboques => {
            DAOCliente.getAll().then(clientes => {
                if(reserva){
                    res.render('reserva/editar', {reserva: reserva, reboques: reboques, clientes: clientes, mensagem: ""})
                } else {
                    res.render('erro', {mensagem: "Erro ao editar reserva."})
                }
            })
        })
    })
})

// ATUALIZAR POST
routerReserva.post('/reserva/atualizar', autorizacao, (req, res) => {
    let {id, dataSaida, dataChegada, valorDiaria, cliente, reboque} = req.body
    DAOReserva.update(id, dataSaida, dataChegada, valorDiaria, cliente, reboque).then(inserido => {
        if(inserido){
            res.redirect('/reserva/lista')
        } else {
            res.render('erro', { mensagem: "Erro ao atualizar." })
        }
    })
})

/** CONTROLADORES ENCARREGADOS DA PARTE DOS RELATÓRIOS */

// LISTAR GET
routerReserva.get('/reserva/lista/:mensagem?', autorizacao, (req, res) => {
    DAOReserva.getAtivas().then(reservas => {
        if (reservas) {
            res.render('reserva/reserva', { reservas: reservas, mensagem: req.params.mensagem ? "Erro! Item já referenciado" : "" })
        } else {
            res.render('erro', { mensagem: "Erro na listagem de reservas." })
        }
    })
})


// RELATORIO HISTORICO GET
routerReserva.get('/reserva/historico/:mensagem?',autorizacao,  (req, res) => {
    DAOReserva.getRelatorioHistorico().then(reservas => {
        if (reservas) {
            res.render('reserva/historico', { reservas: reservas, 
                mensagem: req.params.mensagem ? "Erro! Item já referenciado" : "" })
        } else {
            res.render('erro', { mensagem: "Erro na listagem do historico." })
        }
    })
})

// RELATORIO HISTORICO POST
routerReserva.post('/reserva/filtrarHistorico', autorizacao, (req, res) => {
    let {dataInicio, dataFim} = req.body
    DAOReserva.getRelatorioHistorico(dataInicio, dataFim).then(reservas => {
        if(reservas){
            res.render('reserva/historico', {reservas: reservas})
        } else {
            res.render('erro', {mensagem: "Erro ao filtrar."})
        }
    })
})

// RELATORIO LUCRO GET
routerReserva.get('/reserva/lucro/:mensagem?', autorizacao, (req, res) => {
    DAOReserva.getRelatorioLucro().then(reservas => {
        if(reservas){
            let somaTotal = 0;
            reservas.forEach((reserva) => {
                const valorTotalReserva = parseInt(reserva.dataValues.valorTotal, 10);
                somaTotal += valorTotalReserva;
            });
            res.render('reserva/lucro', {somaTotal: somaTotal, reservas: reservas, mensagem: req.params.mensagem ? 
                "Não é possível excluir um reboque já referenciado por uma locação.":""})
        } else {
            res.render('erro', {mensagem: "Erro ao listar lucros."})
        }
    })
})

// RELATORIO LUCRO POST
routerReserva.post('/reserva/filtrar', autorizacao, (req, res) => {
    let {dataInicio, dataFim} = req.body
    DAOReserva.getRelatorioLucro(dataInicio, dataFim).then(reservas => {
        console.log("Reservas relatorio lucro: ", reservas.map(reserva => reserva.toJSON()));
        if(reservas){
            let somaTotal = 0;
            reservas.forEach((reserva) => {
                const valorTotalReserva = parseInt(reserva.dataValues.valorTotal, 10);
                somaTotal += valorTotalReserva;
            });
            res.render('reserva/lucro', {somaTotal: somaTotal, reservas: reservas})
        } else {
            res.render('erro', {mensagem: "Erro ao filtrar lucros."})
        }
    })
})

module.exports = routerReserva