var express = require('express');
var router = express.Router();
var userAuthentication = require('../../middleware/userAuthentication');
var notificationController = require('../../controllers/notification/notification');

router.get('/', userAuthentication.authenticateUser, notificationController.showAllNotifications);
router.post('/', userAuthentication.authenticateUser, notificationController.createNotification);
router.delete('/', userAuthentication.authenticateUser, notificationController.deleteAllNotifications);

module.exports = router;
