var response = require('../../helper/response');

exports.registerNormalize = function(req) {
    if (req.body.username == null) {
        return response.errorResponse('Username required!');
    }else if (req.body.password == null) {
        return response.errorResponse('Password required!');
    }else if (req.body.email == null) {
        return response.errorResponse('Email required!');
    }else if (req.body.role_id == null) {
        return response.errorResponse('Role ID required!');
    }
    return null;
};

exports.loginNormalize = function(req) {
    if (req.body.username == null && req.body.email == null) {
        return response.errorResponse('Username or email required!');
    }else if (req.body.password == null) {
        return response.errorResponse('Password required!');
    }
    return null;
};