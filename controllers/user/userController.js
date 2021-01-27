const bcrypt = require('bcrypt');
const userFunctions = require("./userFunctions")
const jwt = require('jsonwebtoken')
const config = require("../../config.json")
const connection = require("../../database/db-config")

//Register User


function insertUser(req, res) {
    //Variaveis
    let name = req.body.name
    let img
    let lastName = req.body.lastName
    let number = req.body.number
    let imgMale = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c45f2463-bf29-439a-983d-b7ecb15282ea/ddzrm3d-dd3d836d-b557-4759-8568-b8efcabd4f56.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvYzQ1ZjI0NjMtYmYyOS00MzlhLTk4M2QtYjdlY2IxNTI4MmVhXC9kZHpybTNkLWRkM2Q4MzZkLWI1NTctNDc1OS04NTY4LWI4ZWZjYWJkNGY1Ni5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.AZN2nX7ZSwzahUItJp5IZagrPaj8CaHsFvJFgUAbh80"
    let imgFemale = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c45f2463-bf29-439a-983d-b7ecb15282ea/de00d5q-b8c4b103-6832-467b-b794-e30688acc2d4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvYzQ1ZjI0NjMtYmYyOS00MzlhLTk4M2QtYjdlY2IxNTI4MmVhXC9kZTAwZDVxLWI4YzRiMTAzLTY4MzItNDY3Yi1iNzk0LWUzMDY4OGFjYzJkNC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.eCxLHj1EuJ1E878oyejK7yEQBeWI_WU4VRFHitHpxSI"
    let email = req.body.email
    let birthDate = req.body.birthDate
    let userType_id = 1
    let genre = req.body.genre


    if (genre == "male") {
        img = imgMale
    } else {
        img = imgFemale
    }

    //verify Password = 123AvesChines
    if (req.body.password === req.body.password2) {
        //Encrypting Password
        bcrypt.hash(req.body.password, 10, function (err, hash) {

            userFunctions.register(name, lastName, email, hash, number, img, userType_id, birthDate, genre, (error, success) => {
                if (!error) {
                    res.status(200).send(success)
                } else {
                    res.status(400).send(error)
                }
            })

        })
    } else {
        let message = "Dados Incorretos"
        res.status(404).send(message)
    }
}

//Login User
class LoginValidation {


    login(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        userFunctions.login(email, password, (error, success) => {
            if (!error) {
                res.status(200).send(success)
            } else {
                res.status(400).send(error)
            }
        })
    }
    index(req, res) {
        res.json({
            success: true,
            message: 'Index page',
        });
    }
}


function logout(req, result) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    console.log(token)
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    userFunctions.logout(token, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })

}


//Remove User
function deleteUser(req, result) {
    let id = req.params.id

    userFunctions.deleteUser(id, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        result.json(success)
    })

}


function edit(req, res) {
    let id = req.params.id
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword
    let newPassword2 = req.body.newPassword2
    let number = req.body.number
    let userType = req.body.userType
    if (newPassword != "") {
        if (newPassword === newPassword2) {
            bcrypt.hash(newPassword, 10, function (err, hash) {
                userFunctions.editUser(id, oldPassword, hash, number, userType, (error, success) => {
                    if (error) {
                        throw error;
                        return;
                    }
                    res.json(success)
                })
            })
        } else {
            console.log("Passwords não coincidem")
        }
    } else {
        userFunctions.editUser(id, oldPassword, newPassword, number, userType, (error, success) => {
            if (error) {
                throw error;
                return;
            }
            res.json(success)
        })
    }
}

function changeAvatar(req, res) {
    let idToChange = req.params.id
    let newImg = req.body.newImg
    userFunctions.changeAvatar(idToChange, newImg, (error, success) => {
        if (error) {
            throw error;
            return;
        }
        res.json(success)
    })
}

function getUsers(req, result) {
    userFunctions.getUsers((error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function menuBookingsById(req, result) {
    let idToChange = req.params.id
    userFunctions.menuBookingsById(idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function areaBookingsById(req, result) {
    let idToChange = req.params.id
    userFunctions.areaBookingsById(idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function workshopBookingsById(req, result) {
    let idToChange = req.params.id
    userFunctions.workshopBookingsById(idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function notificationsById(req, result) {
    let idToChange = req.params.id
    userFunctions.notificationsById(idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function archivationsById(req, result) {
    let idToChange = req.params.id
    userFunctions.archivationsById(idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}


function avatarById(req, result) {
    let id = req.params.id
    userFunctions.avatarById(id, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function archive(req, result) {
    let idToChange = req.params.id
    let idUser = req.params.userID
    userFunctions.archive(idUser, idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}

function deleteNotification(req, result) {
    let idToChange = req.params.id
    let idUser = req.params.userID
    userFunctions.deleteNotification(idUser, idToChange, (error, success) => {
        if (error) {
            throw error;
            return;
        };
        result.json(success)
    })
}


//LOGOUT

module.exports = {
    insertUser: insertUser,
    deleteUser: deleteUser,
    edit: edit,
    changeAvatar: changeAvatar,
    getUsers: getUsers,
    menuBookingsById: menuBookingsById,
    areaBookingsById: areaBookingsById,
    workshopBookingsById: workshopBookingsById,
    notificationsById: notificationsById,
    archivationsById: archivationsById,
    archive: archive,
    deleteNotification: deleteNotification,
    logout: logout,
    LoginValidation: LoginValidation,
    avatarById: avatarById,
}