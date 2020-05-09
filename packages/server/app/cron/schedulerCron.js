var Warehouse = require('../models').Warehouse;
var Delivery = require('../models').Delivery;
var Request = require('../models').Request;
var Droppoint = require('../models').Droppoint;
var RequestLine = require('../models').RequestLine;
var Notification = require('../models').Notification;
var {Op} = require('sequelize');
var routeCreation = require('../helper/routeCreation');

exports.scheduler = async () => {
    timeNow = (new Date().getUTCHours() + 7) % 24;
    console.log(`Cron on time: ${timeNow}`);
    warehouses = await Warehouse.findAll();
    for (i = 0; i < warehouses.length; i++) {
        schedules = await warehouses[i].getWarehouseSchedules();
        for (j = 0; j < schedules.length; j++) {
            if (timeNow == schedules[j].Hour) {
                requestLines = await RequestLine.findAll({
                    where: {
                        [Op.and]: [
                            {WarehouseId: warehouses[i].id},
                            {status: 'Open'}
                        ]
                    }
                });
                if (requestLines.length > 0) {
                    points = '';
                    for (k = 0; k < requestLines.length; k++) {
                        request = await Request.findOne({
                            where: {
                                id: requestLines[k].RequestId
                            }
                        });
                        droppoint = await Droppoint.findOne({
                            where: {
                                id: request.DroppointId
                            }
                        });
                        pointString = `${droppoint.longitude},${droppoint.latitude}`
                        points += pointString;
                        if (k < requestLines.length - 1) {
                            points += ';';
                        }
                    }
                    route = await routeCreation.mapsTspEndpoint(`${warehouses[i].longitude},${warehouses[i].latitude}`, points);
                    if (route != null) {
                        route = route.route;
                        routeString = '';
                        for (k = 0; k < route.length; k++) {
                            routeString += route[k];
                            if (k < route.length - 1) {
                                routeString += ';';
                            }
                        }
                        delivery = await Delivery.create({
                            WarehouseId: warehouses[i].id,
                            status: 'Open',
                            Route: routeString
                        });
                        for (k = 0; k < requestLines.length; k++) {
                            requestLines[k].DeliveryId = delivery.id;
                            requestLines[k].status = 'Commited';
                            await requestLines[k].save();
                            request = await Request.findOne({
                                where: {
                                    id: requestLines[k].RequestId
                                }
                            });
                            notification = {
                                message: 'RequestLine #' + requestLines[k].id + ' is in delivery!',
                                UserId: request.UserId
                            };
                            await Notification.create(notification);
                        }
                    } else {
                        console.error('Error on route creation!');
                    }
                }
            }
        }
    }
};