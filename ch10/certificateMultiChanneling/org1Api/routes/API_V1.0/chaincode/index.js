var express = require('express');
var router = express.Router();

var test = require('./test');


router.use('/', test)


module.exports = router;
