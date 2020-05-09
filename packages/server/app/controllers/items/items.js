var response = require('../../helper/response')
var bodyParser = require('body-parser')
var Pool = require('pg').Pool;
var pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password:process.env.POSTGRES_PASSWORD,
    port:process.env.POSTGRES_PORT
})
var Warehouse = require('../../models').Warehouse;
var WarehouseItem = require('../../models').WarehouseItem;
var Item = require('../../models').Item;

//Usage: blank to get all items
//Usage: post request with name and description
//Usage: post with name to check available

exports.itemsGetAll = async function(req,res){
    pool.query('SELECT * FROM "Items"', (err,results) =>{
        if (err){
            throw err;
        }
        return res.status(200).send(response.response(
            {
                items:results.rows
            }
        ))
    })
}

exports.itemsGetByRequestLine = async function(req,res){
    let req_id = "'"+req.query.req_id+"'"
    pool.query('SELECT * FROM "RequestLines" INNER JOIN "Items" ON "RequestLines"."ItemId" = "Items"."id" WHERE "RequestLines"."id" = ' + req_id
    , (err,results) =>{
        if (err){
            throw err;
        }
        return res.status(200).send(response.response(
            {
                items:results.rows
            }
        ))
    })
}

exports.itemsGetByWarehouseId = async function(req, res) {
    let warehouse_id = "'"+req.query.warehouse_id+"'";
    pool.query('SELECT * FROM "Items" INNER JOIN "WarehouseItems" ON "Items"."id" = "WarehouseItems"."ItemId" WHERE "WarehouseItems"."WarehouseId" = ' + warehouse_id
    , (err, results) => {
        if (err) {
            throw err;
        }
        return res.status(200).send(response.response(
            results.rows
        ));
    });
};

exports.itemsGetAvailability = async function(req,res){
    let name = "'"+req.query.name+"'"
    pool.query('SELECT * FROM "Items" WHERE name = ' + name, (err,results) =>{
        if (err){
            throw err;
        }
        return res.status(200).send(response.response(
            {
                available: results.rows.length == 0 ? false : true
            }
        ))
    })
}

exports.addItem = async function(req,res){
    let name = "'"+req.body.name+"'"
    let description = "'"+req.body.description+"'"
    pool.query('INSERT INTO "Items" ("name", "description", "createdAt", "updatedAt") VALUES ('+ name + ',' + description +', current_timestamp, current_timestamp) RETURNING id', (err,results) =>{
        if (err){
            throw err;
        }
        return res.status(200).send(response.response(
            {
                id:results.rows[0]["id"]
            }
        ))
    }
    
    )
}

exports.addWarehouseItem = async function(req, res) {
    warehouse_id = req.body.warehouse_id;
    item_id = req.body.item_id;
    quantity = req.body.quantity;
    if (warehouse_id == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: warehouse_id!', 400));
    }
    if (item_id == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: item_id!', 400));
    }
    if (quantity == null) {
        return res.status(400).send(response.errorResponse('Missing attribute: quantity!', 400));
    }
    warehouse = await Warehouse.findOne({
        where: {
            id: warehouse_id
        }
    });
    if (warehouse == null) {
        return res.status(400).send(response.errorResponse('Warehouse not found!', 400));
    }
    item = await Item.findOne({
        where: {
            id: item_id
        }
    });
    if (item == null) {
        return res.status(400).send(response.errorResponse('Item not found!', 400));
    }
    newWarehouseItem = {
        ItemId: item.id,
        WarehouseId: warehouse.id
    };
    for (i = 0; i < quantity; i++) {
        await WarehouseItem.create(newWarehouseItem);
    }
    return res.status(200).send(response.response(null, 'Item added!', 200));
}

exports.deleteWarehouseItemByItemId = async function(req, res) {
    let warehouseItem_id = req.query.warehouseItem_id;
    pool.query(`DELETE FROM "WarehouseItems" WHERE "WarehouseItems"."id" = ` + warehouseItem_id, (err, results) => {
        if (err) {
            throw err;
        }
        return res.status(200).send(response.response(
            null,
            "WarehouseItems id : " + warehouseItem_id + " deleted successfully!",
            200
        ));
    })
}