var express = require('express');
var router = express.Router();
var userAuthentication = require('../../middleware/userAuthentication');
var requestLineController = require('../../controllers/requestline/requestline');

router.put('/', userAuthentication.authenticateUser, requestLineController.updateRequestLineStatus);
router.post('/', userAuthentication.authenticateUser, requestLineController.createRequestLine);
router.get('/:requestline_id', userAuthentication.authenticateUser, requestLineController.getRequestLine);
router.get('/warehouse/:warehouse_id', userAuthentication.authenticateUser, requestLineController.getRequestLinesByWarehouse);

module.exports = router;
