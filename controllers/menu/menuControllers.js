const menuFunctions = require("./menuFunctions")

function addMenu(req, result) {
    let name = req.body.name;
    let type = req.body.type;
    let newType = req.body.newType
    let img = req.body.img
    /* let img = req.file */
    let ing = req.body.ing

    if(type === "Outro..."){
        menuFunctions.addMenuPlusType(name, newType, img, ing, (error, success) => {
            if (error) {
                throw error;
                return;
            }
            result.json(success)
        })
    }
    else{
        menuFunctions.addMenu(name, type, img, ing, (error, success) => {
            if (error) {
                throw error;
                return;
            }
            result.json(success)
    
        })
    }
}

function removeMenu(req, result) {
    let id = req.params.id

    menuFunctions.removeMenu(id, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    });
};

function getMenus(req, result) {
    menuFunctions.getMenus((error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })
}
function getMenuType(req,result){
    menuFunctions.getMenuType((error, success) =>{
        if(error){
            throw error;
            return;
        }
        result.json(success);
    })
    
}

function getMenu(req, result){
    let id = req.params.id
    menuFunctions.getMenu(id,(error,success)=>{
        if(error){
            throw error;
            return;
        }
        result.json(success)
    })
}

//Aprovar Reserva
function edit(req, result){
    let id = req.params.id
    let name = req.body.name
    let type = req.body.type
    let ings = req.body.ings


    menuFunctions.editMenu(id,name, type, ings, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })

}


module.exports = {
    addMenu: addMenu,
    getMenus: getMenus,
    removeMenu: removeMenu,
    getMenuType: getMenuType,
    getMenu: getMenu,
    edit:edit
}