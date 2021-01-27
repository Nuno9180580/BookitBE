const connection = require("../../database/db-config")



//MENU
function addMenu(name, menuType, img, ing, callback) {
    const sql = `INSERT INTO menu (name, menu_type_id , img, popularity) VALUES(?,?,?,?)`;
    connection.query(sql, [name, menuType, img, 0], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Menu Adicionado!"
        })
        let id = results.insertId
        newMenuNotification(id)
        menuIng(ing, id)
    });
};

function newMenuNotification(id) {
    const sqlMenu = "Select menu.name, menu_Type.description from menu, menu_Type where menu.menu_id = ? and menu.menu_type_id = menu_Type.menu_type_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let menu = rows[0].name
            let type = rows[0].description
            console.log(menu + " " + type)
            let description = "Adicionou um novo menu " + type + " " + menu + "."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user;`
            connection.query(sqlNote, [description, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function addMenuPlusType(name, newType, img, ing, callback) {
    const sql = `INSERT INTO menu_Type (description) VALUES(?)`;
    connection.query(sql, [newType], function (error, result, fields) {
        if (!error) {
            const sql2 = `INSERT INTO menu (name, menu_type_id , img, popularity) VALUES(?,?,?,?)`;
            connection.query(sql2, [name, result.insertId, img, 0], function (error, results, fields) {
                if (error) callback(error);
                callback(null, {
                    success: true,
                    message: "Menu Adicionado"
                })
                let id = results.insertId
                menuIng(ing, id)
            });
        }
    });
};

function menuIng(ing, id) {
    for (let i = 0; i < ing.length; i++) {
        const sqlIng = `INSERT INTO menu_Ingredient (menu_id, ingredient_id) VALUES ( ? , ?)`
        connection.query(sqlIng, [id, ing[i]], function (error, rows, results, fields) {
            if (i === ing.length) {
             connection
            }
        });
    }

}

function removeMenu(id, callback) {
    removeMenuNotification(id)
    let sql = `DELETE FROM menu WHERE menu_id = ?`;
    connection.query(sql, [id], function (err, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            message: "Menu Removido!"
        })
        
    });
}

function removeMenuNotification(id) {
    const sqlMenu = "Select menu.name, menu_Type.description from menu, menu_Type where menu.menu_id = ? and menu.menu_type_id = menu_Type.menu_type_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let menu = rows[0].name
            let type = rows[0].description
            console.log(menu + " " + type)
            let description = "Removeu o menu " + type + " " + menu + "."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user;`
            connection.query(sqlNote, [description, 0, 0], function (error) {
                if (!error) {}
            })
        }
    })
}

//ordenar por popularidade
function getMenus(callback) {
    const sql = `SELECT  menu_id, name,img, popularity, menu_Type.description FROM menu, menu_Type WHERE menu.menu_type_id = menu_Type.menu_type_id ;`;
    connection.query(sql, function (error, rows, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                success: true,
                data: rows
            })
        }
    });

}

function getMenuType(callback) {
    const sql = `SELECT * FROM menu_Type;`;
    connection.query(sql, function (error, rows, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                success: true,
                data: rows
            })
        }
    });

}

function getMenu(id, callback) {
    const sql = `SELECT  menu_id, name,img, popularity, menu_Type.description as type FROM menu, menu_Type WHERE menu_id = ? and menu.menu_type_id = menu_Type.menu_type_id;`;
    connection.query(sql, [id], function (error, rows, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                success: true,
                menu: {
                    id: rows[0].menu_id,
                    name: rows[0].name,
                    img: rows[0].img,
                    popularity: rows[0].popularity,
                    type: rows[0].type,
                }
            })
        }
    });

}

function editMenu(id, name, type, ings, callback) {
    let sqlType = "SELECT menu_type_id FROM menu_Type WHERE description = ?"
    connection.query(sqlType, [type], function (error, rows, fields) {
        let typeID = rows[0].menu_type_id
        if (!error) {
            let sql = "UPDATE menu SET menu.name=?, menu_type_id=?  WHERE menu_id=?;";

            connection.query(sql, [name, typeID, id], function (error, results) {
                if (error) callback(error);
                callback(null, {
                    success: true,
                    message: "Reserva Atualizada",
                })
                removeIngredients(id, ings)

            })
        }

    })


}

function removeIngredients(id, ings) {
    let sql = "DELETE from menu_Ingredient where menu_id=?"
    connection.query(sql, [id], function (error, results) {
        if (!error) {
            addNewIngredients(id, ings)
        }
    })
}

function addNewIngredients(id, ings) {
    for (let i = 0; i < ings.length; i++) {
        let sql = `INSERT INTO menu_Ingredient  (menu_id, ingredient_id) VALUES ( ? , ?)`
        connection.query(sql, [id, ings[i]], function (error, rows, results, fields) {
            if (!error) {

            }
        });
    }
}





module.exports = {
    addMenu: addMenu,
    addMenuPlusType: addMenuPlusType,
    removeMenu: removeMenu,
    getMenus: getMenus,
    getMenuType: getMenuType,
    getMenu: getMenu,
    editMenu: editMenu
}