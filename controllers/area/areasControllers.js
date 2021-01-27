const areasFunctions = require("./areasFunctions")

//Add Area
function addArea(req, result) {
    let name = req.body.name;
    let description = req.body.description;
    let img = req.body.img;

    areasFunctions.addArea(name, description, img, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}

function removeArea(req, result) {
    let id = req.params.id

    areasFunctions.removeArea(id, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    });
};

function updateArea(req, result) {
    let id = req.params.id
    let name = req.body.name
    let description = req.body.description

    areasFunctions.updateArea(name, description, id, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success);
    });
};

function getAreas(req, result) {
    areasFunctions.getAreas( (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function getArea(req, result) {
    let id = req.params.id
    areasFunctions.getArea(id, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

// function searchArea(req, result) {
//     let search = req.body.search
//     areasFunctions.searchArea(search, (error, success) => {
//         if (error) {
//             throw error;
//             return;
//         };
//         result.json(success)
//     });
// }
module.exports = {
    addArea: addArea,
    removeArea: removeArea,
    updateArea: updateArea,
    getAreas: getAreas,
    getArea: getArea,
    // searchArea: searchArea,
    
}

