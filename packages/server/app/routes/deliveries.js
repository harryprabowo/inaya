var express = require('express');
var router = express.Router();
var userAuthentication = require('../middleware/userAuthentication');
var deliveriesController = require('../controllers/deliveries/deliveries');

//Usage supply deliveryID to get status
router.get('/', userAuthentication.authenticateUser, deliveriesController.getDetail);
router.get('/date', deliveriesController.getByDate);
router.get('/requestline', deliveriesController.getByRequestLine)

module.exports = router;
