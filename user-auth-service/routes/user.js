var express = require('express');
var bcrypt = require('bcrypt')
var router = express.Router();
var database = require('../utils/database')
var jwtUtil = require('../utils/jwt')

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
    res.send({error: "user already exists!"})
    return
  }

  bcrypt.hash(password, 10, async function(err, hash) {
    if(err){
      res.send({error: "Password can not be hashed."})
      return
    }
    // register in database
    const result = await database.dbConnection.query(database.insertUserQuery, [username, hash])

    if(result[0].insertId != null && result[0].insertId != -1){
      res.send({result: 'successfully registered user'})
    }else{
      res.send({error: 'error, while creating user!'})
    }
  });
});

router.post('/login', async function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  // check if user exists
  const result = await database.dbConnection.query(database.checkUserExistsQuery, [username]);
  if(result[0].length < 1){
    res.send({error: "user does not exists!"})
    return
  }

  var hash = result[0][0].password_hash

  bcrypt.compare(password, hash, function(err, compareResult){
    if(compareResult){
      res.send({result: "successfully logged in!", jwt: jwtUtil.generateJwtAccessToken(username)})
      return
    }else{
      res.send({error: 'error, wrong password!'})
    }
  });
});

module.exports = router;
