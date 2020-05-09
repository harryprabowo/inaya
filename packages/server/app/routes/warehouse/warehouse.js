var express = require('express');
var router = express.Router();
var userAuthentication = require('../../middleware/userAuthentication');
var warehouseController = require('../../controllers/warehouse/warehouse');

router.get('/', userAuthentication.authenticateUser, warehouseController.getWarehouses);
router.post('/', userAuthentication.authenticateUser, warehouseController.createWarehouse);
router.post('/schedule', userAuthentication.authenticateUser, warehouseController.addSchedule);
router.get('/schedule', userAuthentication.authenticateUser, warehouseController.getSchedules);
router.delete('/schedule', userAuthentication.authenticateUser, warehouseController.deleteSchedule);
router.get('/user', userAuthentication.authenticateUser, warehouseController.getWarehousesByUser);

module.exports = router;