const connection = require("../../database/db-config")


function addBooking(userID, menu, reason, date, time, numberPeople, school, outfit, observations, extras, decor, ing, callback) {
    const sql = `INSERT INTO booking (user_id, menu_id, reason, date, duration, numberPeople, school_id, outfit_id, state_id, observations,decline_txt, opinion) VALUES ( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    connection.query(sql, [userID, menu, reason, date, time, numberPeople, school, outfit, 0, observations, "", ""], function (error, results) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                success: true,
                message: "Pedido de Reserva Enviado"
            })
            let lastId = results.insertId
            DecorBooking(lastId, decor, extras, ing)
        }
    });
}

function DecorBooking(booking_id, decor, extras, ing) {
    for (let d = 0; d < decor.length; d++) {
        const sqlDecor = `INSERT INTO booking_Decor (decoration_id, booking_id) VALUES ( ? , ?)`
        connection.query(sqlDecor, [decor[d], booking_id], function (error, rows, results, fields) {
            if (!error) {
                ExtrasBooking(booking_id, extras, ing)
            } else(error)
        });
    }
}

function ExtrasBooking(booking_id, extras, ing) {
    for (let e = 0; e < extras.length; e++) {
        const sqlExtra = `INSERT INTO booking_Extra (booking_id, extra_id) VALUES ( ? , ?)`
        connection.query(sqlExtra, [booking_id, extras[e]], function (error, rows, results, fields) {
            if (!error) {
                AddOnsBooking(booking_id, ing)
            } else(error)
        });
    }
}

function AddOnsBooking(booking_id, ing) {
    for (let i = 0; i < ing.length; i++) {
        const sqlIng = `INSERT INTO addOn (booking_id, ingredient_id) VALUES ( ? , ?)`
        connection.query(sqlIng, [booking_id, ing[i]], function (error, rows, results, fields) {
            if (i === ing.length) {
            }
        });
    }
}




function editBooking(id, state, decline, opinion, callback) {
    let sql

    if ((!(decline === null || decline === "" || decline === undefined)) && (!(state === null || state === "" || state === undefined))) {
        sql = "UPDATE booking SET decline_txt = ?, state_id = ? WHERE booking_id = ?"

        connection.query(sql, [decline, state, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: "Reserva recusada",
            })
        })
        refuseNotification(id)
    } else if (!(opinion === null || opinion === "" || opinion === undefined)) {
        sql = "UPDATE booking SET opinion = ? WHERE booking_id = ?"

        connection.query(sql, [opinion, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: "Opinião enviada",
            })
        })
        opinionNotification(id)
    } else if (!(state === null || state === "" || state === undefined)) {
        sql = "UPDATE booking SET state_id = ? WHERE booking_id = ?"
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
            approveNotification(id)
        }
    }
}

function approveNotification(id) {
    const sqlMenu = "Select menu.name, menu_Type.description, booking.user_id from menu, booking, menu_Type where  booking_id = ? and menu.menu_id = booking.menu_id and menu.menu_type_id = menu_Type.menu_type_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let menu = rows[0].name
            let type = rows[0].description
            let user_id = rows[0].user_id
            let description = "A sua reserva do menu " + type + " - " + menu + " foi aceite."
            const sqlNote = `insert into notification (user_id, description, type) VALUES (?,?,?)`
            connection.query(sqlNote, [user_id, description, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function refuseNotification(id) {
    const sqlMenu = "Select menu.name, menu_Type.description, booking.user_id from menu, booking, menu_Type where  booking_id = ? and menu.menu_id = booking.menu_id and menu.menu_type_id = menu_Type.menu_type_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let menu = rows[0].name
            let type = rows[0].description
            let user_id = rows[0].user_id
            let description = "A sua reserva do menu " + type + " - " + menu + " foi recusada."
            const sqlNote = `insert into notification (user_id, description, type) VALUES (?,?,?)`
            connection.query(sqlNote, [user_id, description, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function opinionNotification(id) {
    const sqlMenu = "Select menu.name, menu_Type.description from menu, booking, menu_Type where  booking_id = ? and menu.menu_id = booking.menu_id and menu.menu_type_id = menu_Type.menu_type_id"
    connection.query(sqlMenu, [id], function (error, rows, fields) {
        if (!error) {
            let menu = rows[0].name
            let type = rows[0].description
            let description = "Recebeu uma nova opiniao na reserva do menu " + type + " " + menu + "."
            const sqlNote = `insert into notification (user_id, description, type) select user_id, ?,? from user where user.userType_id = ?;`
            connection.query(sqlNote, [description, 0, 0], function (error) {
                if (!error) {
                }
            })
        }
    })
}

function removeBooking(id, callback) {
    let sql = `DELETE FROM booking WHERE booking_id = ?`;
    connection.query(sql, [id], function (err, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            message: "Reserva Removida!"
        })
    });
}

function getBookings(callback) {
    let sql = `select booking.booking_id as "id", menu_Type.description as"menuType",menu.name as "menuName", date, duration,reason, numberPeople, observations,school.school, outfit.name as "outfit", concat(user.name," ", user.lastName) as "userName", user.email, state_booking.description as "state", booking.decline_txt, booking.opinion from booking 
    inner join menu on menu.menu_id = booking.menu_id
    inner join menu_Type on menu.menu_type_id = menu_Type.menu_type_id
    inner join user on booking.user_id = user.user_id
    inner join state_booking on booking.state_id = state_booking.state_id
    inner join school on booking.school_id = school.school_id
    inner join outfit on booking.outfit_id = outfit.outfit_id order by booking.booking_id desc`;
    connection.query(sql, function (err, rows, fields, result) {
        if (err) {
            callback(err);
        }
        callback(null, {
            success: true,
            data: rows
        })
    });
}

function getBookingsDecor(callback) {
    let sql = `SELECT decoration.name, booking_Decor.booking_id FROM booking_Decor, decoration WHERE booking_Decor.decoration_id = decoration.decoration_id;`;
    connection.query(sql, function (err, rows, fields, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            data: rows
        })
        console.log(rows)
    });
}

function getBookingsExtra(callback) {
    let sql = `SELECT extra.name, booking_Extra.booking_id FROM booking_Extra, extra WHERE booking_Extra.extra_id = extra.extra_id;`;
    connection.query(sql, function (err, rows, fields, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            data: rows
        })
        console.log(rows)
    });
}


function getBookingsAddOn(callback) {
    let sql = `SELECT ingredient.name, ingredient.type, addOn.booking_id  FROM addOn, ingredient WHERE addOn.ingredient_id = ingredient.ingredient_id;`;
    connection.query(sql, function (err, rows, fields, result) {
        if (err) callback(error);
        callback(null, {
            success: true,
            data: rows
        })
        console.log(rows)
    });
}


module.exports = {
    addBooking: addBooking,
    editBooking: editBooking,
    removeBooking: removeBooking,
    getBookings: getBookings,
    getBookingsDecor: getBookingsDecor,
    getBookingsExtra: getBookingsExtra,
    getBookingsAddOn: getBookingsAddOn,
}