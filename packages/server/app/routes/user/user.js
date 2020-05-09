var express = require('express');
var router = express.Router();
var userAuthentication = require('../../middleware/userAuthentication');
var userController = require('../../controllers/user/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/validate', userAuthentication.authenticateUser, userController.validate);

module.exports = router;
