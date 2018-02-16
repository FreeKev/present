var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.use(express.static(__dirname + '../public/'));

router.get('/list', function(req, res){
  db.user.findAll({
    where: {
      checkSession: req.params.checkSession
    }
  }).then(function(message){
      res.render('../views/roster/list', {results: people});
      console.log(results);
  });
  console.log('list route')
});

module.exports = router;
