const workshopFunctions = require("./workshopsFunctions")

//Adicionar Workshop
function addWorkshop(req, result) {
    let name = req.body.name;
    let teacher = req.body.teacher;
    let date = req.body.date;
    let description = req.body.description;
    let hi = req.body.hi; //Hora inicio
    let hf = req.body.hf; //Hora final
    let time = hi + "-" + hf
    let vacancies = req.body.vacancies;
    let img = req.body.img;
    workshopFunctions.addWorkshop(name, date, teacher, description, img, vacancies, time, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

//Eliminar Workshop
function removeWorkshop(req, result) {
    let id = req.params.id;
    workshopFunctions.removeWorkshop(id, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

//Editar workshop
function updateWorkshop(req, result) {
    let id = req.params.id
    let name = req.body.name;
    let teacher = req.body.teacher;
    let date = req.body.date;
    let description = req.body.description;
    let time = req.body.time
    let vacancies = req.body.vacancies;
    workshopFunctions.updateWorkshop(id, name, date, teacher, description, vacancies, time, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

function getWorkshops(req, result) {
    workshopFunctions.getWorkshops((error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    });
}

function getWorkshop(req, result) {
    let id = req.params.id
    workshopFunctions.getWorkshop(id,(error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    });
}

module.exports = {
    addWorkshop: addWorkshop,
    removeWorkshop: removeWorkshop,
    updateWorkshop: updateWorkshop,
    getWorkshops: getWorkshops,
    getWorkshop: getWorkshop
}