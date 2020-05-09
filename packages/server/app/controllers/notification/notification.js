var Notification = require('../../models').Notification;
var response = require('../../helper/response');

exports.showAllNotifications = async (req, res) => {
    try {
        return req.user.getNotifications().then((notifications) => {
            res.status(200).send(response.response(notifications, 'All notifications from current user successfully fetched!', 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.createNotification = async (req, res) => {
    try {
        msg = req.body.message;
        if (msg == null) {
            return res.status(400).send(response.response(null, 'Notification message required!', 400));
        }
        notification = {
            UserId: req.user.id,
            message: msg
        };
        return Notification.create(notification).then((notification) => {
            res.status(200).send(response.response(null, `Notification created for username: ${req.user.username}!`, 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.deleteAllNotifications = async (req, res) => {
    try {
        return Notification.destroy({
            where: {
                UserId: req.user.id
            }
        }).then(() => {
            res.status(200).send(response.response(null, `All notifications from username: ${req.user.username} has been deleted.`, 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};