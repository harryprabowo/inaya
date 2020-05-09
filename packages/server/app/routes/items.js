var express = require('express');
var router = express.Router();
var itemsController = require('../controllers/items/items');

router.get('/', itemsController.itemsGetAll);
router.get('/availability', itemsController.itemsGetAvailability);
router.get('/requestline', itemsController.itemsGetByRequestLine)
router.get('/warehouse', itemsController.itemsGetByWarehouseId);
router.post('/warehouse', itemsController.addWarehouseItem);
router.delete('/warehouse', itemsController.deleteWarehouseItemByItemId);
router.post('/add', itemsController.addItem);

module.exports = router;
