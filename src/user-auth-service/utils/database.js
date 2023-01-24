/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: process.env.MARIADB_SERVICE,
    database: 'my_database',
    port: '3306',
    user: 'root',
    password: process.env.MARIADB_PASSWORD,
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
    "name varchar(255) UNIQUE NOT NULL default '', " +
    "PRIMARY KEY (id))"
const CREATE_ROLE_USER_TABLE_QUERY = "CREATE TABLE IF NOT EXISTS users_roles(" +
    "user_id int(11) unsigned NOT NULL REFERENCES users(id), " +
    "role_id int(11) unsigned NOT NULL REFERENCES roles(id), " +
    "PRIMARY KEY (user_id,role_id))"

const CHECK_USER_EXISTS_QUERY = "SELECT username, password_hash, id FROM users WHERE username = ?"
const CHECK_TOKEN_EXISTS_QUERY = "SELECT token FROM tokens WHERE token = ?"

const SELECT_PASSWORD_HASH_QUERY = "SELECT password_hash FROM users WHERE username = ?"

const INSERT_USER_QUERY = "INSERT INTO users(username, password_hash) VALUES(?, ?)"
const INSERT_TOKEN_QUERY = "INSERT INTO tokens(token) VALUES(?)"
const INSERT_ROLE_QUERY = "INSERT INTO roles(name) VALUES(?)"
const INSERT_USER_ROLE_QUERY = "INSERT INTO users_roles(user_id, role_id) VALUES(?, ?)"

const SELECT_USERNAME_FOR_ID = "SELECT username FROM users WHERE id = ?"
const SELECT_ID_FOR_NAME = "SELECT id FROM users WHERE username = ?"
const SELECT_USER_FOR_ROLE = "SELECT users.id, users.username, roles.name FROM users "
    + "INNER JOIN users_roles ON users.id=users_roles.user_id "
    + "INNER JOIN roles ON roles.id=users_roles.role_id AND roles.name = ?;"
const SELECT_USER_WITH_ROLE_FOR_USER_ID = "SELECT users.id, users.username, roles.name as role_name FROM users "
    + "LEFT JOIN users_roles ON users.id=users_roles.user_id "
    + "LEFT JOIN roles ON roles.id=users_roles.role_id "
    + "WHERE users.id = ?;"


exports.createUserTableQuery = CREATE_USER_TABLE_QUERY
exports.createTokenTableQuery = CREATE_TOKEN_TABLE_QUERY
exports.createRoleTableQuery = CREATE_ROLE_TABLE_QUERY
exports.createRoleUserTableQuery = CREATE_ROLE_USER_TABLE_QUERY
exports.selectPasswordHashQuery = SELECT_PASSWORD_HASH_QUERY

exports.insertUserQuery = INSERT_USER_QUERY
exports.insertTokenQuery = INSERT_TOKEN_QUERY
exports.insertRoleQuery = INSERT_ROLE_QUERY
exports.insertUserToRoleQuery = INSERT_USER_ROLE_QUERY

exports.checkUserExistsQuery = CHECK_USER_EXISTS_QUERY
exports.checkTokenExistsQuery = CHECK_TOKEN_EXISTS_QUERY
exports.selectUserNameQuery = SELECT_USERNAME_FOR_ID
exports.selectIdForName = SELECT_ID_FOR_NAME
exports.selectUserForRole = SELECT_USER_FOR_ROLE
exports.selectUserWithRole = SELECT_USER_WITH_ROLE_FOR_USER_ID

exports.dbConnection = connection
