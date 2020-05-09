var Warehouse = require('../../models').Warehouse;
var Delivery = require('../../models').Delivery;
var WarehouseSchedule = require('../../models').WarehouseSchedule;
var response = require('../../helper/response');

exports.getWarehouses = async (req, res) => {
    try {
        const id = req.query.id;
        const delivery = req.query.delivery_id;
        const facility = req.query.facility_id;
        let warehouses;

        if (id != null && id != '' && !isNaN(id)) {
            warehouses = await Warehouse.findOne({
                where: { id }
            })

            if (warehouses.UserId != req.user.id) {
                return res.status(403).send(response.errorResponse('Forbidden!', 403));
            }
        } else if (delivery != null && delivery != '' && !isNaN(delivery)) {
            warehouses = await Warehouse.findOne({
                where: { id: facility }
            })
        } else {
            warehouses = await Warehouse.findAll({
                attributes: {
                    exclude: ['UserId']
                }
            });
        }

        if (warehouses === null) {
            return res.status(400).send(response.errorResponse('Warehouses not found!', 400));
        }

        res.status(200).send(response.response(warehouses, 'All warehouses from current user successfully fetched!', 200));
    } catch (err) {
        console.log(err)
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
}

exports.createWarehouse = async (req, res) => {
    try {
        const lat = req.body.latitude;
        const lon = req.body.longitude;
        if (lat == null) {
            return res.status(400).send(response.response(null, 'Latitude required!', 400));
        }
        if (lon == null) {
            return res.status(400).send(response.response(null, 'Longitude required!', 400));
        }
        const warehouse = {
            UserId: req.user.id,
            latitude: lat,
            longitude: lon,
        };

        const newWarehouse = await Warehouse.create(warehouse)
        if (newWarehouse === null) res.status(400).send(response.errorResponse(err, 400));

        return res.status(200).send(response.response(newWarehouse, 200));

    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.addSchedule = async (req, res) => {
    const warehouseId = req.body.warehouse_id;
    if (warehouseId == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: warehouse_id!', 400));
    }
    const hour = req.body.hour;
    if (hour == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: hour!', 400));
    } else if (hour < 0 || hour > 23) {
        return res.status(400).send(response.errorResponse('Invalid attribute value: hour!', 400));
    }
    const warehouse = await Warehouse.findOne({
        where: {
            id: warehouseId
        }
    });
    if (warehouse == null) {
        return res.status(400).send(response.errorResponse('Warehouse not found!', 400));
    }
    const warehouseSchedules = await warehouse.getWarehouseSchedules({
        where: {
            Hour: hour
        }
    });
    if (warehouseSchedules.length > 0) {
        return res.status(400).send(response.errorResponse('Schedule on that hour already exists!', 400));
    }
    try {
        const warehouseSchedule = {
            WarehouseId: warehouseId,
            Hour: hour
        }
        await WarehouseSchedule.create(warehouseSchedule);
        return res.status(200).send(response.response(null, `Warehouse schedule created for warehouse with ID: ${warehouseId}, Hour: ${hour}`, 200));
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
};

exports.getSchedules = async (req, res) => {
    const warehouseId = req.query.warehouse_id;
    if (warehouseId == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: warehouse_id!', 400));
    }
    const warehouse = await Warehouse.findOne({
        where: {
            id: warehouseId
        }
    });
    if (warehouse == null) {
        return res.status(400).send(response.errorResponse('Warehouse not found!', 400));
    }
    const warehouseSchedules = await warehouse.getWarehouseSchedules();
    return res.status(200).send(response.response(warehouseSchedules, 'Warehouse schedules successfully fetched!', 200));
};

exports.deleteSchedule = async (req, res) => {
    const scheduleId = req.query.schedule_id;
    if (scheduleId == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: schedule_id!', 400));
    }
    const warehouseSchedule = await WarehouseSchedule.findOne({
        where: {
            id: scheduleId
        }
    });
    if (warehouseSchedule == null) {
        return res.status(400).send(response.errorResponse('Schedule not found!', 400));
    }
    try {
        await warehouseSchedule.destroy();
        return res.status(200).send(response.response(null, `Warehouse schedule deleted for schedule with ID: ${scheduleId}`, 200));
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
}

exports.getWarehousesByUser = async (req, res) => {
    try {
        return req.user.getWarehouses().then((warehouses) => {
            res.status(200).send(response.response(warehouses, 'All warehouses from current user successfully fetched!', 200));
        }).catch((err) => {
            res.status(400).send(response.errorResponse(err, 400));
        });
    } catch (err) {
        return res.status(500).send(response.errorResponse('Internal error.', 500));
    }
}