const connection = require("../../database/db-config")

function addIngredient(name, type, callback) {
    const sql = `INSERT INTO ingredient (name, type) VALUES(?, ?)`;
    connection.query(sql, [name, type], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Ingrediente Adicionado!",
        });
    });
}

function removeIngredient(id, callback) {
    const sql = `DELETE FROM ingredient WHERE ingredient_id = ?`;
    connection.query(sql, [id], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Ingrediente Removido!"
        });
    });

}

function addDecor(name, callback) {
    const sql = `INSERT INTO decoration (name) VALUES (?)`;
    connection.query(sql, [name], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Decoração Adicionada!"
        });
    });

};

function removeDecor(id, callback) {
    const sql = `DELETE FROM decoration WHERE decoration_id = ?`;
    connection.query(sql, [id], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Decoração Removida!"
        });
    });

};

function addOutfit(img, name, callback) {
    const sql = `INSERT INTO outfit (img, name) VALUES (?, ?)`;
    connection.query(sql, [img, name], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Farda Adicionada!"
        });
    });
};

function removeOutfit(id, callback) {
    const sql = `DELETE FROM outfit WHERE outfit_id = ?`;
    connection.query(sql, [id], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Farda Removida!"
        });
    });
};

function addExtra(name, callback) {
    const sql = `INSERT INTO extra (name) VALUES (?)`;
    connection.query(sql, [name], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Extra Adicionado!"
        });
    });
};

function removeExtra(id, callback) {
    const sql = `DELETE FROM extra WHERE extra_id = ?`;
    connection.query(sql, [id], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Extra Removido!"
        })
    })
}

function getIngredients(callback) {
    let sql = `SELECT * from ingredient`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
        
    })
}

function getIngredientByMenu(id, callback) {
    let sql = `select ingredient.ingredient_id, ingredient.name, ingredient.type from ingredient, menu, menu_Ingredient where menu.menu_id=?  AND menu.menu_id = menu_Ingredient.menu_id and ingredient.ingredient_id = menu_Ingredient.ingredient_id`;
    connection.query(sql,[id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            ingredients: rows
        })
        
    })
}

function getDecors(callback) {
    let sql = `SELECT * from decoration`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function getSchools(callback) {
    let sql = `SELECT * from school`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}


function getOutfits(callback) {
    let sql = `SELECT * from outfit`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function getExtras(callback) {
    let sql = `SELECT * from extra`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

module.exports = {
    addIngredient: addIngredient,
    removeIngredient: removeIngredient,
    addDecor: addDecor,
    removeDecor: removeDecor,
    addOutfit: addOutfit,
    removeOutfit: removeOutfit,
    getIngredients: getIngredients,
    getDecors: getDecors,
    getExtras: getExtras,
    getOutfits: getOutfits,
    getSchools: getSchools,
    addExtra: addExtra,
    removeExtra: removeExtra,
    getIngredientByMenu: getIngredientByMenu
}