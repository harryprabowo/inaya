var express = require('express');
var router = express.Router();
var dropPointController = require('../controllers/droppoint/droppoint');
var userAuthentication = require('../middleware/userAuthentication');

router.get('/', dropPointController.getDroppoint)
router.post('/create', dropPointController.dropPointCreateDroppoint);
router.get('/user', userAuthentication.authenticateUser, dropPointController.getDroppointsByUser);

module.exports = router;
