var User = require('../../models').User;
var Request = require('../../models').Request;
var RequestLine = require('../../models').RequestLine;
var Warehouse = require('../../models').Warehouse;
var WarehouseItem = require('../../models').WarehouseItem;
var Droppoint = require('../../models').Droppoint;
var Item = require('../../models').Item;
var Notification = require('../../models').Notification;
var response = require('../../helper/response');
var distance = require('../../helper/distance');

exports.createRequestLine = async(req, res) => {
    try {
        request_id = req.body.request_id;
        if (request_id == null) {
            return res.status(400).send(response.errorResponse('Missing attribute: request_id!', 400));
        }
        items = req.body.items;
        if (items == null) {
            return res.status(400).send(response.errorResponse('Missing attribute: items!', 400));
        }
        if (!Array.isArray(items)) {
            return res.status(400).send(response.errorResponse('Wrong attribute: items should be an array!', 400));
        }
        for (i = 0; i < items.length; i++) {
            if (items[i] == null) {
                return res.status(400).send(response.errorResponse('Missing attribute: item_id!', 400));
            }
            item = await Item.findOne({
                where: {
                    id: items[i].id
                }
            });
            if (item == null) {
                return res.status(400).send(response.errorResponse(`Item not found fo item ID: ${items[i].id}`, 400));
            }
        }
        request = await Request.findOne({
            where: {
                id: request_id
            }
        });
        if (request == null) {
            return res.status(400).send(response.errorResponse('Request not found!', 400));
        }
        droppoint = await Droppoint.findOne({
            where: {
                id: request.DroppointId
            }
        });
        unavailableItems = [];
        for (i = 0; i < items.length; i++) {
            availableItems = await WarehouseItem.findAll({
                where: {
                    ItemId: items[i].id
                }
            });
            if (availableItems.length == 0) {
                unavailableItems.push(items[i].id);
                unavailableRequestLine = {
                    RequestId: request_id,
                    WarehouseId: null,
                    ItemId: items[i].id,
                    status: 'Closed'
                };
                await RequestLine.create(unavailableRequestLine);
                itemNotFound = await Item.findOne({
                    where: {
                        id: items[i].id
                    }
                });
                notification = {
                    message: 'RequestLine for ' + itemNotFound.name + ' not created because unavailable!',
                    UserId: request.UserId
                }
                await Notification.create(notification);
                continue;
            }
            warehousesItemCount = {};
            for (j = 0; j < availableItems.length; j++) {
                if (availableItems[j].WarehouseId in warehousesItemCount) {
                    warehousesItemCount[availableItems[j].WarehouseId]++;
                } else {
                    warehousesItemCount[availableItems[j].WarehouseId] = 1;
                }
            }
            for (warehouseId in warehousesItemCount) {
                if (warehousesItemCount[warehouseId] < items[i].quantity) {
                    delete warehousesItemCount[warehouseId];
                }
            }
            if (Object.keys(warehousesItemCount).length == 0) {
                unavailableItems.push(items[i].id);
                unavailableRequestLine = {
                    RequestId: request_id,
                    WarehouseId: null,
                    ItemId: items[i].id,
                    status: 'Closed'
                };
                await RequestLine.create(unavailableRequestLine);
                itemNotFound = await Item.findOne({
                    where: {
                        id: items[i].id
                    }
                });
                notification = {
                    message: 'RequestLine for ' + itemNotFound.name + ' not created because unavailable!',
                    UserId: request.UserId
                }
                await Notification.create(notification);
                continue;
            }
            warehouses = [];
            for (warehouseId in warehousesItemCount) {
                warehouse = await Warehouse.findOne({
                    where: {
                        id: warehouseId
                    }
                });
                warehouses.push(warehouse);
            }
            closestWarehouseId = 0;
            for (j = 1; j < warehouses.length; j++) {
                currentDistance = distance.getDistance(`${warehouses[j].longitude},${warehouses[j].latitute}`, `${droppoint.longitude},${droppoint.latitute}`);
                closestDistance = distance.getDistance(`${warehouses[closestWarehouseId].longitude},${warehouses[closestWarehouseId].latitute}`, `${droppoint.longitude},${droppoint.latitute}`);
                if (currentDistance < closestDistance) {
                    closestWarehouseId = j;
                }
            }
            requestLine = {
                RequestId: request_id,
                WarehouseId: warehouses[closestWarehouseId].id,
                ItemId: items[i].id,
                status: 'Open',
                Quantity: items[i].quantity
            };
            itemsToDelete = await WarehouseItem.findAll({
                where: {
                    WarehouseId: warehouses[closestWarehouseId].id
                }
            });
            for (j = 0; j < items[i].quantity; j++) {
                itemsToDelete[j].destroy();
            }
            await RequestLine.create(requestLine);
        }
        return res.status(200).send(response.response({unavailable_items: unavailableItems}, `Requestlines created for username: ${req.user.username}, UserId: ${req.user.id}.`, 200));
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.updateRequestLineStatus = async (req, res) => {
    try {
        request_id = req.body.RequestId;
        if (request_id == null) {
            return res.status(400).send(response.response(null, 'RequestId required!', 400));
        } else {
            request = await Request.findOne({
                where: {
                    id: request_id,
                    UserId: req.user.id
                }
            });
            if (request == null) {
                return res.status(400).send(response.errorResponse(`RequestId:${request_id} not found for UserId:${req.user.id} !`, 400));
            }
        }
        warehouse_id = req.body.WarehouseId;
        if (warehouse_id == null) {
            return res.status(400).send(response.response(null, 'WarehouseId required!', 400));
        }
        item_id = req.body.ItemId;
        if (item_id == null) {
            return res.status(400).send(response.response(null, 'ItemId required!', 400));
        }

        request_line = await RequestLine.findOne({
            where: {
                WarehouseId: warehouse_id,
                ItemId: item_id
            }
        });
        if (request_line == null) {
            return res.status(400).send(response.errorResponse(`RequestLine not found for WarehouseId:${warehouse_id} and ItemId:${item_id} !`, 400));
        } else {
            if (req.body.status == null) {
                return res.status(400).send(response.response(null, 'Status required!', 400));
            } else {
                return await RequestLine.update({
                    status: req.body.status
                },
                {
                    where: {
                        RequestId: request_id,
                        WarehouseId: warehouse_id,
                        ItemId: item_id
                    }
                }).then((result) => {
                    res.status(200).send(response.response(result, `RequestLine's status for RequestId:${request_id}, WarehouseId:${warehouse_id}, and ItemId:${item_id} successfully changed to ${req.body.status}!`, 200));
                }).catch((err) => {
                    res.status(400).send(response.response(err, 400));
                });
            }
        }
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.getRequestLine = async (req, res) => {
    requestline_id = req.params.requestline_id;
    if (requestline_id == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: requestline_id!', 400));
    }
    requestline = await RequestLine.findOne({
        where: {
            id: requestline_id
        }
    });
    if (requestline == null) {
        return res.status(400).send(response.errorResponse('Requestline not found!!', 400));
    }
    return res.status(200).send(response.response(requestline, 'Requestline found!', 200));
};

exports.getRequestLinesByWarehouse = async (req, res) => {
    warehouse_id = req.params.warehouse_id;
    if (warehouse_id == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: request_id!', 400));
    }
    requestlines = await RequestLine.findAll({
        where: {
            WarehouseId: warehouse_id
        }
    });
    return res.status(200).send(response.response(requestlines, 'RequestLines fetched!', 200));
}