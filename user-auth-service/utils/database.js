var mysql      = require('mysql2/promise');
var connection = mysql.createPool({
    host     : process.env.MARIADB_SERVICE,
    database : 'my_database',
    port     : '3306',
    user     : 'root',
    password : process.env.MARIADB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const CREATE_USER_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS users(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "username varchar(255) NOT NULL default '', " +
    "password_hash varchar(255) NOT NULL default '', " +
    "PRIMARY KEY (id))"
const CREATE_TOKEN_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS tokens(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "token varchar(255) NOT NULL default ''," +
    "PRIMARY KEY (id))"
const CREATE_ROLE_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS roles(" +
    "id int(11) unsigned NOT NULL auto_increment, " +
    "role_name varchar(255) NOT NULL default '', " +
    "PRIMARY KEY (id))"
const CREATE_ROLE_USER_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS roles_users(" +
    "user_id int(11) unsigned NOT NULL REFERENCES users(id), " +
    "role_id int(11) unsigned NOT NULL REFERENCES roles(id), " +
    "PRIMARY KEY (user_id,role_id))"

const CHECK_USER_EXISTS_QUERY = "SELECT username, password_hash, id FROM users WHERE username = ?"
const CHECK_TOKEN_EXISTS_QUERY = "SELECT token FROM tokens WHERE token = ?"

const SELECT_PASSWORD_HASH_QUERY = "SELECT password_hash FROM users WHERE username = ?"

const INSERT_USER_QUERY = "INSERT INTO users(username, password_hash) VALUES(?, ?)"
const INSERT_TOKEN_QUERY = "INSERT INTO tokens(token) VALUES(?)"

const SELECT_USERNAME_FOR_ID = "SELECT username FROM users WHERE id = ?"
const SELECT_ID_FOR_NAME = "SELECT id FROM users WHERE username = ?"


exports.checkUserExistsQuery = CHECK_USER_EXISTS_QUERY
exports.checkTokenExistsQuery = CHECK_TOKEN_EXISTS_QUERY
exports.createUserTableQuery = CREATE_USER_TABLE_QUERY
exports.createTokenTableQuery = CREATE_TOKEN_TABLE_QUERY
exports.createRoleTableQuery = CREATE_ROLE_TABLE_QUERY
exports.createRoleUserTableQuery = CREATE_ROLE_USER_TABLE_QUERY
exports.selectPasswordHashQuery = SELECT_PASSWORD_HASH_QUERY
exports.selectUserNameQuery = SELECT_USERNAME_FOR_ID
exports.selectIdForName = SELECT_ID_FOR_NAME
exports.insertUserQuery = INSERT_USER_QUERY
exports.insertTokenQuery = INSERT_TOKEN_QUERY
exports.dbConnection = connection