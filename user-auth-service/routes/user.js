var express = require('express');
var bcrypt = require('bcrypt')
var router = express.Router();
var database = require('../utils/database')
var jwtUtil = require('../utils/jwt')
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  // check if user already exists
  const result = await database.dbConnection.query(database.checkUserExistsQuery, [username]);
  if(result[0].length > 0){
    res.status(409).json({message: "user already exists!"})
    return
  }

  bcrypt.hash(password, 10, async function(err, hash) {
    if(err){
      res.status(500).json({message: "Password can not be hashed."})
      return
    }
    // register in database
    const result = await database.dbConnection.query(database.insertUserQuery, [username, hash])

    if(result[0].insertId != null && result[0].insertId != -1){
      res.json({result: 'successfully registered user'})
    }else{
      res.status(500).json({message: 'error, while creating user!'})
    }
  });
});

router.post('/login', async function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  // check if user exists
  const result = await database.dbConnection.query(database.checkUserExistsQuery, [username]);
  if(result[0].length < 1){
    res.status(404).json({message: "Given user does not exists!"})
    return
  }

  var hash = result[0][0].password_hash

  bcrypt.compare(password, hash, function(err, compareResult){
    if(compareResult){
      res.json({result: "successfully logged in!", jwt: jwtUtil.generateJwtAccessToken(username, result[0][0].id)})
      return
    }else{
      res.status(401).json({message: 'Wrong password!'})
    }
  });
});

router.post('/username', async function(req, res){
  if(!req.body)
    return res.sendStatus(400)

  var jwtToken = req.body.jwt;
  var userId = req.body.userid;

  jwt.verify(jwtToken, jwtUtil.JwtSecret, async function (err, user) {
    if(err) {
      return res.sendStatus(401);
    }

    // get userId for username
    const result = await database.dbConnection.query(database.selectUserNameQuery, [userId])

    if(result[0].length != 0){
      res.json({username: result[0][0].username})
    }else{
      res.sendStatus(404)
    }
  });
});

router.post('/useridForName', async function(req, res){
  if(!req.body)
    return res.sendStatus(400)

  var jwtToken = req.body.jwt;
  var username = req.body.username;

  jwt.verify(jwtToken, jwtUtil.JwtSecret, async function (err, user) {
    if(err) {
      return res.sendStatus(401);
    }

    // get userId for username
    const result = await database.dbConnection.query(database.selectIdForName, [username])

    if(result[0].length != 0){
      res.json({userId: result[0][0].id})
    }else{
      res.sendStatus(404)
    }
  });
});


module.exports = router;
