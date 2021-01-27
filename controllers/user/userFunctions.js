const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../../config.json");
const connection = require("../../database/db-config")



function login(email, password, callback) {
    //Get info from user
    let samePW = false

    const query = `SELECT * FROM user, school WHERE email = ? AND user.school_id = school.school_id;`
    connection.query(query, [email], function (err, result) {
        if (!err) {
            let message = "success"

               


            if (result.length == 0) {
                message = "Dados Inválidos"
            } else {
                samePW = bcrypt.compareSync(password, result[0].password)
                if (samePW == false) {
                    result = []
                    message = "Dados Inválidos"
                } else if (samePW && result[0].userType_id == 2) {
                    result = []
                    message = "Dados Inválidos"
                }
            }
            if (result.length > 0) {
                if(result[0].userType_id != 3){

                    const sqlCount = `SELECT COUNT(*) as count FROM notification WHERE user_id = ? AND type = 0;`
                    connection.query(sqlCount, [result[0].user_id], function (error, countRows, results, fields) {
                        if (!error) {}
                        let count
                        if (countRows === undefined || countRows === null) {
                            count = 0
                        } else {
                            count = countRows[0].count
                        }
                        const token = jwt.sign({
                            id: result[0].user_id,
                            name: result[0].name,
                            lastName: result[0].lastName,
                            number: result[0].number,
                            school: result[0].school,
                            email: email,
                            birthDate: result[0].birthDate,
                            notifications: count,
                            type: result[0].userType_id,
                        }, config.secret)
                        callback(null, {
                            token: token,
                            response: result
                        })
                    });
                }else{
                     message = "Conta Bloqueada!"
                    callback({
                        message: message
                    })
                }


            } else {
                callback({
                    message: message
                })
            }
        } else {
            let message = "Erro de ligação"
            callback({
                message: message
            })
        }
    })
}

function register(name, lastName, email, hash, number, img, userType_id, birthDate, genre, callback) {
    //Get School from mail
    const sql2 = `SELECT school_id FROM school WHERE INSTR(?, school) > 0;`
    connection.query(sql2, [email], function (error, rows, results, fields) {
        if (!error) {
            console.log(rows)
            let school = rows[0].school_id

            //Insert user into DB
            const sql = `INSERT INTO user (name, lastName, email, password, number, img, userType_id, school_id, birthDate, genre) VALUES ( ? , ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(sql, [name, lastName, email, hash, number, img, userType_id, school, birthDate, genre], function (error, results, fields) {
                if (error) callback(error);
                callback(null, {
                    success: true,
                    message: "Conta criada com sucesso!"
                })
            });
        } else {
            callback(error)
        }
    });
}

function editUser(id, oldPassword, newPassword, number, userType, callback) {
    let sql

    if (!(newPassword === null || newPassword === "" || newPassword === undefined)) {
        const verify = "SELECT password FROM user WHERE user_id = ?;"
        connection.query(verify, [id], function (error, rows, results) {
            if (!error) {
                bcrypt.compare(oldPassword, rows[0].password, function (err, res) {
                    if (err) {
                        callback("Password atual incorreta")
                    }
                    if (res) {
                        sql = "UPDATE  user SET password = ? WHERE  user_id  = ?"
                        connection.query(sql, [newPassword, id], function (error, results) {
                            if (error) callback(error);
                            callback(null, {
                                success: true,
                                message: "Utilizador atualizado"
                            })
                        })
                    }
                })
            }
        })
    }

    if (!(number === null || number === "" || number === undefined)) {
        sql = "UPDATE  user SET number = ? WHERE  user_id  = ?"
        connection.query(sql, [number, id], function (error, results) {
            if (error) {
                callback(error);
            } else {
                const query = `SELECT * FROM user, school WHERE user_id = ? AND user.school_id = school.school_id;`
                connection.query(query, [id], function (err, result) {
                    if (!err) {
                        const sqlCount = `SELECT COUNT(*) as count FROM notification WHERE user_id = ? AND type = 0;`
                        connection.query(sqlCount, [result[0].user_id], function (error, countRows, results, fields) {
                            let count
                            if (countRows === undefined || countRows === null) {
                                count = 0
                            } else {
                                count = countRows[0].count
                            }
                            const token = jwt.sign({
                                id: id,
                                name: result[0].name,
                                lastName: result[0].lastName,
                                number: number,
                                school: result[0].school,
                                email: result[0].email,
                                birthDate: result[0].birthDate,
                                notifications: count,
                                type: result[0].userType_id,
                            }, config.secret)
                            callback(null, {
                                success: true,
                                message: "Utilizador atualizado",
                                token: token
                            })
                        });
                    }
                })
            }
        })
    }

    if (!(userType === null || userType === "" || userType === undefined)) {
        sql = "UPDATE  user SET userType_id = ? WHERE  user_id  = ?"
        connection.query(sql, [userType, id], function (error, results) {
            if (error) callback(error);
            callback(null, {
                success: true,
                message: "Utilizador atualizado"
            })
        })
    }
}

function changeAvatar(id, newImg, callback) {
    var sql = `UPDATE user SET img = ? WHERE user_id = ?`
    connection.query(sql, [newImg, id], function (err, result) {
        if (err) callback(err);
        callback(null, {
            success: true,
            message: "Imagem de Perfil Atualizada!"
        })
    })
}

function logout(token, callback) {
    let sql = `INSERT INTO blacklist(token) VALUES(?)`
    connection.query(sql, [token], function (err, result) {
        if (err) callback(err);
        callback(null, {
            sucess: true,
            message: "Sessão Terminada!"
        })
    });
}

function deleteUser(id, callback) {
    console.log("Connected!");
    var sql = `DELETE FROM user WHERE user_id = ?`;
    connection.query(sql, [id], function (err, result) {
        if (err) callback(err);
        callback(null, {
            success: true,
            message: "Utilizador Eliminado!"
        })
    });
}

function getUsers(callback) {
    let sql = `SELECT user_id, name, lastName, email, number, user_Type.type FROM user, user_Type WHERE user.userType_id = user_Type.userType_id order by user.user_id asc`;
    connection.query(sql, function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function menuBookingsById(id, callback) {
    let sql = `select booking_id , menu.name, menu_Type.description, menu.img, date, duration, school.school, state_booking.description as state, booking.opinion, booking.decline_txt
    from booking, menu, menu_Type, school, state_booking
    where booking.menu_id = menu.menu_id and menu.menu_type_id = menu_Type.menu_type_id 
    and booking.school_id = school.school_id and booking.state_id = state_booking.state_id 
    and booking.user_id = ?;
    `;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function areaBookingsById(id, callback) {
    let sql = `select  area_booking_id, area.name, area.img, date, duration, state_booking.description as state, area_Booking.opinion
    from area_Booking, area, state_booking
    where area_Booking.area_id = area.area_id and area_Booking.state_id = state_booking.state_id 
    and area_Booking.user_id = ?;`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}


function workshopBookingsById(id, callback) {
    let sql = `select workshop.workshop_id, name, workshop.img, date, duration from workshop, inscription
    where workshop.workshop_id = inscription.workshop_id and inscription.user_id = ?;`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function notificationsById(id, callback) {
    let sql = `select notification_id, user_id, description, type from notification
    where notification.user_id = ? and notification.type = 0;`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        console.log(rows);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function archivationsById(id, callback) {
    let sql = `select notification_id, user_id, description from notification
    where notification.user_id = ? and notification.type = 1;`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        callback(null, {
            success: true,
            data: rows
        })
    })
}

function avatarById(id, callback) {
    let sql = `select img from user where user_id = ?;`;
    connection.query(sql, [id], function (error, rows, result) {
        if (error) callback(error);
        callback(null, {
            success: true,
            data: rows[0].img
        })
    })
}

function archive(idUser, id, callback) {
    let sql = `update notification set type = 1 where notification_id = ? and user_id=?;`;
    connection.query(sql, [id, idUser], function (error, rows, result) {
        if (error) {
            callback(error);
        } else {
            const query = `SELECT * FROM user, school WHERE user_id = ? AND user.school_id = school.school_id;`
            connection.query(query, [idUser], function (err, result) {
                if (!err) {
                    const sqlCount = `SELECT COUNT(*) as count FROM notification WHERE user_id = ? AND type = 0;`
                    connection.query(sqlCount, [idUser], function (error, countRows, results, fields) {
                        let count
                        if (countRows === undefined || countRows === null) {
                            count = 0
                        } else {
                            count = countRows[0].count
                        }
                        const token = jwt.sign({
                            id: idUser,
                            name: result[0].name,
                            lastName: result[0].lastName,
                            number: result[0].number,
                            school: result[0].school,
                            email: result[0].email,
                            birthDate: result[0].birthDate,
                            notifications: count,
                            type: result[0].userType_id,
                        }, config.secret)
                        callback(null, {
                            success: true,
                            message: "Notificação arquivada",
                            token: token
                        })
                    });
                }
            })
        }
    })
}

function deleteNotification(idUser, id, callback) {
    let sql = `delete from notification where notification_id = ? and user_id=?;`;
    connection.query(sql, [id, idUser], function (error, rows, result) {
        if (error) {
            callback(error);
        } else {
            const query = `SELECT * FROM user, school WHERE user_id = ? AND user.school_id = school.school_id;`
            connection.query(query, [idUser], function (err, result) {
                if (!err) {
                    const sqlCount = `SELECT COUNT(*) as count FROM notification WHERE user_id = ? AND type = 0;`
                    connection.query(sqlCount, [idUser], function (error, countRows, results, fields) {
                        let count
                        if (countRows === undefined || countRows === null) {
                            count = 0
                        } else {
                            count = countRows[0].count
                        }
                        const token = jwt.sign({
                            id: idUser,
                            name: result[0].name,
                            lastName: result[0].lastName,
                            number: result[0].number,
                            school: result[0].school,
                            email: result[0].email,
                            birthDate: result[0].birthDate,
                            notifications: count,
                            type: result[0].userType_id,
                        }, config.secret)
                        callback(null, {
                            success: true,
                            message: "Notificação eliminada",
                            token: token
                        })
                    });
                }
            })
        }
    })
}

module.exports = {
    login: login,
    register: register,
    editUser: editUser,
    changeAvatar: changeAvatar,
    logout: logout,
    deleteUser: deleteUser,
    getUsers: getUsers,
    menuBookingsById: menuBookingsById,
    areaBookingsById: areaBookingsById,
    workshopBookingsById: workshopBookingsById,
    notificationsById: notificationsById,
    archivationsById: archivationsById,
    archive: archive,
    deleteNotification: deleteNotification,
    avatarById: avatarById,
}