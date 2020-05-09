var express = require('express');
var router = express.Router();
var testController = require('../controllers/test/test');
var userAuthentication = require('../middleware/userAuthentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testCreate', testController.testCreateEndpoint);
router.get('/testJWT', userAuthentication.authenticateUser, testController.testJWTEndpoint);

module.exports = router;
