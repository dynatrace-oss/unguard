var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')
var jwtUtil = require('../utils/jwt')

router.get('/jwtRS256.key.pub', async function (req, res) {
    res.json(jwtUtil.JwtPublic.toString());
});

module.exports = router;