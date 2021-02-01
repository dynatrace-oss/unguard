var mysql      = require('mysql2/promise');
var fs         = require('fs');
var connection = mysql.createPool({
    host     : 'localhost',
    database : 'my_database',
    port     : '3306',
    user     : 'root',
    password : 'rVPrNO4SRH',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const CREATE_USER_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS users(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "username varchar(255) NOT NULL default '', " +
    "password_hash varchar(255) NOT NULL default '', " +
    "PRIMARY KEY  (id))"
const CREATE_TOKEN_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS tokens(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "token varchar(255) NOT NULL default ''," +
    "PRIMARY KEY (id))"

const CHECK_USER_EXISTS_QUERY = "SELECT username, password_hash FROM users WHERE username = ?"
const CHECK_TOKEN_EXISTS_QUERY = "SELECT token FROM tokens WHERE token = ?"

const SELECT_PASSWORD_HASH_QUERY = "SELECT password_hash FROM users WHERE username = ?"

const INSERT_USER_QUERY = "INSERT INTO users(username, password_hash) VALUES(?, ?)"
const INSERT_TOKEN_QUERY = "INSERT INTO tokens(token) VALUES(?)"

exports.checkUserExistsQuery = CHECK_USER_EXISTS_QUERY
exports.checkTokenExistsQuery = CHECK_TOKEN_EXISTS_QUERY
exports.createUserTableQuery = CREATE_USER_TABLE_QUERY
exports.createTokenTableQuery = CREATE_TOKEN_TABLE_QUERY
exports.selectPasswordHashQuery = SELECT_PASSWORD_HASH_QUERY
exports.insertUserQuery = INSERT_USER_QUERY
exports.insertTokenQuery = INSERT_TOKEN_QUERY
exports.dbConnection = connection