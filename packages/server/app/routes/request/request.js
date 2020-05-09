var express = require('express');
var router = express.Router();
var userAuthentication = require('../../middleware/userAuthentication');
var requestController = require('../../controllers/request/request');

router.get('/', userAuthentication.authenticateUser, requestController.showAllRequests);
router.get('/details/:request_id', userAuthentication.authenticateUser, requestController.getRequestDetailsById);
router.post('/', userAuthentication.authenticateUser, requestController.createRequest);

module.exports = router;