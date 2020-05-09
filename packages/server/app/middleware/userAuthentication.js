var jwt = require('jsonwebtoken');
var response = require('../helper/response');
var User = require('../models').User;

exports.authenticateUser = function (req, res, next) {
    authHeader = req.headers['authorization'];
    jwtToken = authHeader && authHeader.split(' ')[1];
    if (jwtToken == null) {
        return res.status(400).send(response.errorResponse(
            'Invalid session!',
            401
        ));
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(400).send(response.errorResponse(
                'Invalid session!',
                401
            ));
        };
        req.user = await User.findOne({
            where: {
                username: user.username
            }
        });
        if (req.user == null) {
            return res.status(400).send(response.errorResponse(
                'Invalid session!',
                401
            ));
        }
        next();
    });
};