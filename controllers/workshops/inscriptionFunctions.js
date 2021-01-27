const connection = require("../../database/db-config")

function addInscription(idUser, idWorkshop, callback) {
    const sql2 = `INSERT INTO inscription (workshop_id, user_id) VALUES(?,?)`
    connection.query(sql2, [idWorkshop, idUser], function (error, results, fields) {
        if (!error) {
            const sql = `SELECT filled from workshop WHERE workshop_id = ?`;
            connection.query(sql, [idWorkshop], function (error, rows, fields) {
                if (!error) {
                    let newFilled = rows[0].filled + 1
                    const sql2 = `UPDATE workshop SET filled = ? where workshop_id = ?`
                    connection.query(sql2, [newFilled, idWorkshop], function (error, results, fields) {
                        if (!error) {
                            callback(null, {
                                success: true,
                                message: "Inscrito no Workshop!"
                            })
                        }
                    });
                }
            });
        } else {
            callback({
                message: "Já Inscrito!"
            })
        }
    });
}


function getInscription(callback) {
    let sql = `SELECT * from inscription`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows[0]
        })
    })
}

module.exports = {
    addInscription: addInscription,
    getInscription: getInscription
}