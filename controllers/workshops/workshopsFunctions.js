const connection = require("../../database/db-config")


function addWorkshop(name, date, teacher, description, img, vacancies, time, callback) {
    const sql = `INSERT INTO workshop (name, date, teacher, description, img, vacancies, duration, filled) VALUES(?,?,?,?,?,?,?,?)`;
    connection.query(sql, [name, date, teacher, description, img, vacancies, time, 0], function (error, results, fields) {
        if (error) callback(error);
        callback(null, {
            success: true,
            message: "Workshop Adicionado!"
        })
        let id = results.insertId
        addNotification(id)
    });
}

function addNotification(id) {
    const sqlWork = "Select workshop.name from workshop where workshop_id = ?"
    connection.query(sqlWork, [id], function (error, rows, fields) {
        if (!error) {
            let workshop = rows[0].name
            let description = "O workshop " + workshop + " foi adicionado."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user WHERE user.userType_id = ? OR user.userType_id = ?;`
            connection.query(sqlNote, [description, 0, 0, 1], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function removeWorkshop(id, callback) {
    deleteNotification(id)
    const sql = `DELETE FROM workshop WHERE workshop_id = ?`
    connection.query(sql, [id], function (err, result) {
        if (err) callback(err);
        callback(null, {
            success: true,
            message: "Workshop Removido"
        })
    })
}

function deleteNotification(id) {
    const sqlWork = "Select workshop.name from workshop where workshop_id = ?"
    connection.query(sqlWork, [id], function (error, rows, fields) {
        if (!error) {
            let workshop = rows[0].name
            let description = "O workshop " + workshop + " foi removido."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user;`
            connection.query(sqlNote, [description, 0, 0], function (error) {
                if (!error) {}
            })
        }
    })
}

function updateWorkshop(id, name, date, teacher, description, vacancies, time, callback) {
    const sql = `UPDATE workshop SET name = ?, date = ?, teacher = ?, description = ?, vacancies = ?, duration = ? WHERE workshop_id = ?`
    connection.query(sql, [name, date, teacher, description, vacancies, time, id], function (err, result) {
        if (err) callback(err);
        callback(null, {
            success: true,
            message: "Workshop Atualizado!"
        })
    })
}

function getWorkshops(callback) {
    let sql = `SELECT* from workshop  order by workshop.workshop_id desc`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function getWorkshop(id, callback) {
    let sql = `SELECT * FROM workshop WHERE workshop_id = ? `;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

module.exports = {
    addWorkshop: addWorkshop,
    removeWorkshop: removeWorkshop,
    updateWorkshop: updateWorkshop,
    getWorkshops: getWorkshops,
    getWorkshop: getWorkshop
}