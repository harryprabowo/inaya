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

var Delivery = require('../../models').Delivery;

exports.getDetail = async function(req,res){
    let id = req.query.id
    if (id != null && id != '' && !isNaN(id)){
        pool.query('SELECT * FROM "Deliveries" WHERE id = ' + id, (err,results) =>{
            if (err){
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    status: results.rows.length > 0 ? results.rows[0] : results.rows
                }
            ))
        })
    }else{
        requests = await req.user.getRequests();
        requestlines = [];
        for (i = 0; i < requests.length; i++) {
            requestlines.push((await requests[i].getRequestLines())[0]);
        }
        console.log(requestlines);
        deliveries = [];
        for (i = 0; i < requestlines.length; i++) {
            currentDeliveries = await Delivery.findOne({
                where: {
                    id: requestlines[i].DeliveryId
                }
            });
            if (currentDeliveries != null && !deliveries.includes(currentDeliveries)) {
                deliveries.push(currentDeliveries);
            }
        }
        return res.status(200).send(response.response(deliveries, 'Deliveries fetched successfully!', 200));
    }

}

exports.getByDate = async function(req,res){
    let date = req.query.date
    if (date != null){
        pool.query('SELECT status FROM "Deliveries" WHERE estimated_time_arrival = \'' + date + '\'', (err,results) =>{
            console.log('SELECT status FROM "Deliveries" WHERE estimated_time_arrival = \'' + date + '\'')
            if (err){
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    status: results.rows.length > 0 ? results.rows[0] : results.rows
                }
            ))
        })
    }else{
        return res.status(400).send(response.errorResponse("Invalid param count!", 400))
    }

}

exports.getByRequestLine = async function(req,res){
    let req_id = "'" + req.query.req_id + "'"
    if (req_id != null){
        pool.query('SELECT * FROM "Deliveries" WHERE \'RequestLineId\' = ' + req_id , (err,results) =>{
            if (err){
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    details: results.rows.length > 0 ? results.rows[0] : results.rows
                }
            ))
        })
    }else{
        return res.status(400).send(response.errorResponse("Invalid param count!", 400))
    }

} 