var express = require('express');
var jwt = require('jsonwebtoken')
var jwtUtil = require('../utils/jwt')
const database = require("../utils/database");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('auth-route');
});

router.post('/logout',  async function(req, res){
    if(!req.body)
        return res.sendStatus(403)

    var jwtToken = req.body.jwt;

    jwt.verify(jwtToken, jwtUtil.JwtSecret, async function (err, user) {
        if(err) {
            return res.sendStatus(401);
        }

        // add token in database as invalidated tokens
        const result = await database.dbConnection.query(database.insertTokenQuery, [jwtToken])

        if(result[0].insertId != null && result[0].insertId != -1){
            res.send('{"result": "successfully logged out!"}')
        }else
            return res.sendStatus(401)
    });
});

router.post('/isValid', function(req, res){
    if (!req.body)
        return res.sendStatus(403);

    var jwtToken = req.body.jwt;

    jwt.verify(jwtToken, jwtUtil.JwtSecret, async function(err, user){
       if(err) {
           return res.sendStatus(401);
       }
       // check if token is not banned
        const result = await database.dbConnection.query(database.checkTokenExistsQuery, [jwtToken]);
        if(result[0].length > 0){
            return res.sendStatus(401)
        }
       return res.send('{"result": "token is valid"}')
    });
});

module.exports = router;
