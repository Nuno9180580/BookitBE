const bookingAreasFunctions = require("./areasBookingFunctions")



//ADICIONAR FUNÇÃO DE ESTADO CONCLUÍDO 

//Fazer Reserva
function newAreaBooking(req, result) {
    //Variaveis
    let reason = req.body.reason
    let date = req.body.date
    let initHour = req.body.initHour
    let endHour = req.body.endHour
    let time = initHour + "-" + endHour
    let area = req.body.area
    let userID = req.body.userID

    bookingAreasFunctions.addAreasBooking(userID, area, reason, date, time, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

//Aprovar Reserva
function edit(req, result) {
    let id = req.params.id
    let state = req.body.state
    let decline = req.body.decline
    let opinion = req.body.opinion



    bookingAreasFunctions.editAreaBooking(id, state, decline,opinion, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })

}


//Remover Reserva
function removeAreaBooking(req, result) {
    let id = req.params.id
    bookingAreasFunctions.removeAreaBooking(id, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

//Tabela das Reservas
function areasBooking(req, result) {
    bookingAreasFunctions.areasBooking((error, sucess) => {
        if (error) {
            throw error;
            return;
        }
        result.json(sucess)
    })
}


module.exports = {
    newAreaBooking: newAreaBooking,
    edit: edit,
    removeAreaBooking: removeAreaBooking,
    areasBooking: areasBooking,
}