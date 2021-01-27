const connection = require("../../database/db-config")

function addArea(name, description, img, callback) {
    let id
    const sql = `INSERT INTO area (name, description, img) VALUES(?,?,?)`;
    connection.query(sql, [name, description, img], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Espaço Adicionado!"
        })
        id = results.insertId;
        addAreaNotification(id)
    });
}

function addAreaNotification(id) {
    const sqlArea = "Select area.name from area where area_id = ?"
    connection.query(sqlArea, [id], function (error, rows, fields) {
        if (!error) {
            let areaName = rows[0].name
            let description = "A área " + areaName + " foi adicionada."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user where user.userType_id = ? or user.userType_id = ?;`
            connection.query(sqlNote, [description, 0, 0, 1], function (error) {
                if (!error) {
                } else {
                    console.log(error)
                }
            })
        }
    })
}

function removeArea(id, callback) {
    removeAreaNotification(id);
    let sql = `DELETE FROM area WHERE area_id = ?`;
    connection.query(sql, [id], function (error, result) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Espaço Removido!"
        });
    });
}

function removeAreaNotification(id) {
    const sqlArea = "Select area.name from area where area_id = ?"
    connection.query(sqlArea, [id], function (error, rows, fields) {
        if (!error) {
            let areaName = rows[0].name
            let description = "A área " + areaName + " foi eliminada."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user where user.userType_id = ? or user.userType_id = ?;`
            connection.query(sqlNote, [description, 0, 0, 1], function (error) {
                if (!error) {}
            })
        }
    })
}

function updateArea(name, description, id, callback) {
    let sql = `UPDATE area SET name = ?, description = ? WHERE area_id = ?`;
    connection.query(sql, [name, description, id], function (error, result) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Espaço Atualizado!"
        });
    });

};

function getAreas(callback) {
    let sql = `SELECT * FROM area order by area.area_id desc`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows)
        callback(null, {
            success: true,
            data: rows
        });
    });
};

function getArea(id, callback) {
    let sql = `SELECT * FROM area WHERE area_id = ?`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows)
        callback(null, {
            success: true,
            data: rows
        });
    });
};


module.exports = {
    addArea: addArea,
    removeArea: removeArea,
    updateArea: updateArea,
    getAreas: getAreas,
    getArea: getArea
}