var express = require('express');
var router = express.Router();

var registerUser = require('../../utils/registerUser')

router.post('/', async (req, res, next) =>  {
  try{
      let data = await registerUser();
      console.log(data)
      return res.status(201).json(data)
  } catch (err) {
      return res.status(500).json(err)
  }
  
});

module.exports = router;
