const connection = require("../../database/db-config")



function addAreasBooking(userID, area, reason, date, time, callback) {
    const sql = `INSERT INTO area_Booking (user_id, area_id, reason, date, duration, state_id, decline_txt) VALUES ( ? , ?, ?, ?, ?, ?, ?)`
    connection.query(sql, [userID, area, reason, date, time, 0, ""], function (error, results) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                success: true,
                message: "Pedido de Reserva Enviado!"
            })
        }
    });
}


function editAreaBooking(id, state, decline, opinion, callback) {
    let sql

    if ((!(decline === null || decline === "" || decline === undefined)) && (!(state === null || state === "" || state === undefined))) {
        sql = "UPDATE area_Booking SET decline_txt = ?, state_id = ? WHERE area_booking_id = ?"

        connection.query(sql, [decline, state, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: "Reserva recusada",
            })
        })
        refuseNotification(id)
    } else if (!(opinion === null || opinion === "" || opinion === undefined)) {
        sql = "UPDATE area_Booking SET opinion = ? WHERE area_booking_id = ?"

        connection.query(sql, [opinion, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: "Opinião enviada",
            })
        })
        opinionNotification(id)
    } else if (!(state === null || state === "" || state === undefined)) {
        sql = "UPDATE area_Booking SET state_id = ? WHERE area_booking_id = ?"
        let txt
        if (state == 1) {
            txt = "Reserva Aprovada"
        } else if (state == 3) {
            txt = "Reserva Concluída"
        }

        connection.query(sql, [state, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: txt,
            })
        })
        if (state == 1) {
            aproveAreaNotification(id)
        }
    }
}

function aproveAreaNotification(id) {
    const sqlMenu = "Select area.name, area_Booking.user_id from area, area_Booking where  area_booking_id = ? and area.area_id = area_Booking.area_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let area = rows[0].name
            let user_id = rows[0].user_id
            let description = "A sua reverva do espaço '" + area + "' foi aceite."
            const sqlNote = `insert into notification (user_id, description, type) VALUES (?,?,?)`
            connection.query(sqlNote, [user_id, description, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function refuseNotification(id) {
    const sqlMenu = "Select area.name, area_Booking.user_id from area, area_Booking where  area_booking_id = ? and area.area_id = area_Booking.area_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let area = rows[0].name
            let user_id = rows[0].user_id
            let description = "A sua reverva do espaço '" + area + "' foi recusada."
            const sqlNote = `insert into notification (user_id, description, type) VALUES (?,?,?)`
            connection.query(sqlNote, [user_id, description, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function opinionNotification(id) {
    const sqlMenu = "Select area.name, area_Booking.user_id from area, area_Booking where  area_booking_id = ? and area.area_id = area_Booking.area_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let area = rows[0].name
            let user_id = rows[0].user_id
            let description = "Recebeu uma nova opiniao na reserva da area " + area + "."
            const sqlNote = `insert into notification (user_id, description, type) select ?, ?,? from user where user.userType_id = ?;`
            connection.query(sqlNote, [user_id, description, 0], function (error) {
                if (!error) {
                }
                else{
                }
            })
        }
    })
}

function removeAreaBooking(id, callback) {
    let sql = `DELETE FROM area_Booking WHERE area_booking_id = ?`;
    connection.query(sql, [id], function (err, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            message: "Reserva Removida!"
        })
    });
}

function areasBooking(callback) {
    let sql = `SELECT area_booking_id, concat(user.name," ", user.lastName) as "userName", user.email, area.name, date, duration, reason, state_booking.description, area_Booking.decline_txt, area_Booking.opinion FROM area_Booking inner join user on area_Booking.user_id=user.user_id inner join area on area_Booking.area_id = area.area_id inner join state_booking on area_Booking.state_id = state_booking.state_id`
    connection.query(sql, function (error, rows, fields) {
        if (error) callback(error);
        callback(null, {
            sucess: true,
            data: rows
        })
    })
}



module.exports = {
    addAreasBooking: addAreasBooking,
    removeAreaBooking: removeAreaBooking,
    areasBooking: areasBooking,
    editAreaBooking: editAreaBooking
}