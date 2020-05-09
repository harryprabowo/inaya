var Request = require('../../models').Request;
var Item = require('../../models').Item;
var RequestLine = require('../../models').RequestLine;
var Droppoint = require('../../models').Droppoint;
var response = require('../../helper/response');

exports.showAllRequests = async (req, res) => {
    try {
        return req.user.getRequests().then((requests) => {
            res.status(200).send(response.response(requests, 'All requests\' ID from current user successfully fetched!', 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.getRequestDetailsById = async (req, res) => {
    const request_id = req.params.request_id;
    if (request_id == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: request_id!', 400));
    }
    if (!/^\d+$/.test(request_id)) {
        return res.status(400).send(response.errorResponse('Parameter request_id is not an integer!', 400));
    }
    const request = await Request.findOne({
        where: {
            id: request_id
        }
    });
    if (request == null) {
        return res.status(400).send(response.errorResponse('Request not found!', 400));
    } else if (request.UserId != req.user.id) {
        return res.status(403).send(response.errorResponse('Forbidden!', 403));
    }
    const requestlines = await request.getRequestLines();
    const returnValue = [];
    for (let i = 0; i < requestlines.length; i++) {
        const item = await Item.findOne({
            where: {
                id: requestlines[i].ItemId
            }
        });
        returnValue.push({
            requestline: requestlines[i],
            item: item
        });
    }
    return res.status(200).send(response.response({
        request,
        data: returnValue
    }, 'Request detail is successfully fetched!', 200));
};


exports.createRequest = async (req, res) => {
    try {
        droppoint_id = req.body.droppoint_id;
        if (droppoint_id == null) {
            return res.status(400).send(response.errorResponse('Missing attribute: droppoint_id!', 400));
        }
        droppoint = await Droppoint.findOne({
            where: {
                id: droppoint_id
            }
        });
        if (droppoint == null) {
            return res.status(400).send(response.response(null, 'Droppoint not found!', 400));
        }
        request = {
            UserId: req.user.id,
            DroppointId: droppoint_id
        };
        return Request.create(request).then((request) => {
            res.status(200).send(response.response(request, `Request created for username: ${req.user.username}, UserId: ${req.user.id}, with DroppointId: ${droppoint_id}`, 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};
