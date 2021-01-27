const bookingFunctions = require("./bookingFunctions")

//Fazer Reserva
function newBooking(req, result) {
    //Variaveis
    let reason = req.body.reason
    let date = req.body.date
    let school = req.body.school
    let initHour = req.body.initHour
    let endHour = req.body.endHour
    let time = initHour + "-" + endHour
    let numberPeople = req.body.numberPeople
    let outfit = req.body.outfit
    let observations = req.body.observations
    let menu = req.body.menu
    let userID = req.body.userID
    let decor = req.body.decor
    let extras = req.body.extras
    let ing = req.body.ing


    bookingFunctions.addBooking(userID, menu, reason, date, time, numberPeople, school, outfit, observations, extras, decor, ing, (error, success) => {
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


    bookingFunctions.editBooking(id, state, decline, opinion, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })

}


//Remover Reserva
function removeBooking(req, result) {
    let id = req.params.id
    bookingFunctions.removeBooking(id, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}


function getBookings(req, result) {
    bookingFunctions.getBookings((error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}



function getBookingsDecor(req, result) {
    bookingFunctions.getBookingsDecor((error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

function getBookingsExtra(req, result) {
    bookingFunctions.getBookingsExtra((error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

function getBookingsAddOn(req, result) {
    bookingFunctions.getBookingsAddOn((error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}


module.exports = {
    newBooking: newBooking,
    removeBooking: removeBooking,
    getBookings: getBookings,
    getBookingsDecor: getBookingsDecor,
    getBookingsExtra: getBookingsExtra,
    getBookingsAddOn: getBookingsAddOn,
    edit: edit,

}