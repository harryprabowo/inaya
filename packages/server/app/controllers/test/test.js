var Notification = require('../../models').Notification;
var response = require('../../helper/response');

exports.testCreateEndpoint = function(req, res) {
    return Notification.create({
        message: req.query.message
    }).then (
        notification => res.status(200).send(
            {
                message: 'Notification created!',
                notification: notification
            }
        )
    ).catch(
        error => res.status(400).send(error)
    );
}

exports.testJWTEndpoint = function(req, res) {
    return res.status(200).send(response.response(
        req.user,
        'JWT test successful!',
        200
    ));
}