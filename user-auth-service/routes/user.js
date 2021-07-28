var express = require('express');
var bcrypt = require('bcrypt')
var router = express.Router();
var database = require('../utils/database')
var jwtUtil = require('../utils/jwt')
var jwt = require('jwt-simple')

router.post('/register', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // check if user already exists
  const result = await database.dbConnection.query(database.checkUserExistsQuery, [username]);
  if (result[0].length > 0) {
    res.status(409).json({ message: "user already exists!" })
    return
  }

  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      res.status(500).json({ message: "Password can not be hashed." })
      return
    }
    // register in database
    const result = await database.dbConnection.query(database.insertUserQuery, [username, hash])

    if (result[0].insertId != null && result[0].insertId != -1) {
      res.json({ result: 'successfully registered user' })
    } else {
      res.status(500).json({ message: 'error, while creating user!' })
    }
  });
});

router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // check if user exists
  const result = await database.dbConnection.query(database.checkUserExistsQuery, [username]);
  if (result[0].length < 1) {
    res.status(404).json({ message: "Given user does not exists!" })
    return
  }

  const user = result[0][0];
  const roles = await database.dbConnection.query(database.selectUserWithRole, [user.id]).then((response) => {
    const userWithRoles = response[0];
    if (userWithRoles.length == 0) { return []; }

    const userRoles = [];
    userWithRoles.forEach(user => {
      if (user.role_name !== null) {
        userRoles.push("" + user.role_name);
      }
    });

    return userRoles;
  });


  bcrypt.compare(password, user.password_hash, function (err, compareResult) {
    if (compareResult) {
      res.json({ result: "successfully logged in!", jwt: jwtUtil.generateJwtAccessToken(username, user.id, roles) })
      return
    } else {
      res.status(401).json({ message: 'Wrong password!' })
    }
  });
});

router.post('/username', async function (req, res) {
  if (!req.body)
    return res.sendStatus(400)

  var jwtToken = req.body.jwt;
  var userId = req.body.userid;

  let decoded;
  try {
    // Vulnerable, because no algorithm is enforced for decoding
    // https://www.cvedetails.com/cve/CVE-2016-10555/
    decoded = jwt.decode(jwtToken, jwtUtil.JwtPublic);

    // get userId for username
    const result = await database.dbConnection.query(database.selectUserNameQuery, [userId])

    if (result[0].length != 0) {
      res.json({ username: result[0][0].username })
    } else {
      res.sendStatus(404)
    }

  } catch (ex) {
    return res.sendStatus(401);
  }

});

router.post('/useridForName', async function (req, res) {
  if (!req.body)
    return res.sendStatus(400)

  var jwtToken = req.body.jwt;
  var username = req.body.username;

  let decoded;
  try {
    // Vulnerable, because no algorithm is enforced for decoding
    // https://www.cvedetails.com/cve/CVE-2016-10555/
    decoded = jwt.decode(jwtToken, jwtUtil.JwtPublic);

    // get userId for username
    const result = await database.dbConnection.query(database.selectIdForName, [username])

    if (result[0].length != 0) {
      res.json({ userId: result[0][0].id })
    } else {
      res.sendStatus(404)
    }
  } catch (ex) {
    return res.sendStatus(401);
  }
});


module.exports = router;
