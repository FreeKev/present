var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

router.use(express.static(__dirname + '../public/'));

router.get('/list/:sessionid', function(req, res){
  db.user.findAll({
    where: {
      sessionid: req.params.sessionid
    }
  }).then(function(message){
      res.render('../views/roster/list', {results: people});
      console.log(results);
  });
});

module.exports = router;
