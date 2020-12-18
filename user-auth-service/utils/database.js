var mysql      = require('mysql2/promise');
var fs         = require('fs');
var connection = mysql.createPool({
    host     : 'localhost',
    database : 'my_database',
    port     : '3306',
    user     : 'root',
    password : 'new_password',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const CREATE_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS users(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "username varchar(255) NOT NULL default '', " +
    "password_hash varchar(255) NOT NULL default '', " +
    "PRIMARY KEY  (id))"
const CHECK_USER_EXISTS_QUERY = "SELECT username, password_hash FROM users WHERE username = ?"
const SELECT_PASSWORD_HASH_QUERY = "SELECT password_hash FROM users WHERE username = ?"
const INSERT_USER_QUERY = "INSERT INTO users(username, password_hash) VALUES(?, ?)"

exports.checkUserExistsQuery = CHECK_USER_EXISTS_QUERY
exports.createTableQuery = CREATE_TABLE_QUERY
exports.selectPasswordHashQuery = SELECT_PASSWORD_HASH_QUERY
exports.insertUserQuery = INSERT_USER_QUERY
exports.dbConnection = connection