const mysql = require('mysql');

let connect;

function disconnect() {
    connect = mysql.createConnection({
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD,
        database:process.env.DATABASE
    }); 
   
    connect.connect(function (err) { 
        if (err) { 
            console.log('error when connecting to db:', err);
            setTimeout(disconnect, 2000); 
        } 
    }); 
   
    connect.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            disconnect(); 
        } else { 
            disconnect() 
            throw err; 
        }
    });
}

disconnect();

module.exports = connect;