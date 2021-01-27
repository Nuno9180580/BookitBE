const jwt = require('jsonwebtoken');
const config = require("./config.json");
const connection = require("./database/db-config")

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  console.log(token)
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }


  const sql = `SELECT token FROM blacklist WHERE token = ?`
  connection.query(sql, [token], function (error, rows, fields) {
    if (rows.length !== 0) {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    } else if(rows.length === 0){
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  })
}

module.exports = {
  checkToken: checkToken
}