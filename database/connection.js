const config = require('./config');
const mysql = require('mysql2');
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:config.dataBaseName,
    password:config.password
}).promise();

module.exports = connection;
