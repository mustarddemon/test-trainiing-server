var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var userHelper = require('../lib/user_helper');


/* GET home page. */
router.get('/test', function(req, res) {

  //Data passed in can be used in jade template engine
  return res.render('index.pug');
});

//Sample REST API get request
router.get('/users/:user_id', function(req, res) {
  //Can access variables in path
  var userId = req.params.user_id;
  console.log('USER ID', userId);

  //Can access query parameters
  var queryParam = req.query.queryParam;

  if (userId !== "1") {
    var error = {
      message: "Could not find user with id " + userId
    }
    return res.send(404, error)
  }
  return res.send(200, { user: "testuser", id: 1});
});

//Can post with req variable
router.post('/users', jsonParser, function(req, res) {

  req.body.id = 2;
  var result = req.body;

  if (result.message) {
    var error = {
      message: "Could not create user because of error: " + result.message
    }
    return res.send(400, error);
  } else {
    return res.send(200, result);
  }

});


module.exports = router;
