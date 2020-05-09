var response = require('../../helper/response')
var bodyParser = require('body-parser')
var Pool = require('pg').Pool;
var pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
})

//Usage: blank to get all
//Usage: supply by id

exports.getDroppoint = async function (req, res) {
    if (req.query.delivery_id != null) {
        pool.query(`select "Droppoints"."id", "Droppoints"."longitude", "Droppoints"."latitude", "Droppoints"."createdAt", "Droppoints"."updatedAt" from(("RequestLines" inner join "Deliveries" on "RequestLines"."DeliveryId" = "Deliveries"."id") inner join "Requests" on "Requests"."id" = "RequestId") inner join "Droppoints" on "Droppoints"."id" = "DroppointId" where "Deliveries"."id" = ${req.query.delivery_id}`, (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    droppoints: results.rows
                }
            ))
        })
    } else if (req.query.id != null) {
        pool.query('SELECT * FROM "Droppoints" WHERE id = ' + req.query.id, (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    droppoints: results.rows
                }
            ))
        })
    } else {
        pool.query('SELECT * FROM "Droppoints"', (err, results) => {
            if (err) {
                throw err;
            }
            return res.status(200).send(response.response(
                {
                    droppoints: results.rows
                }
            ))
        })
    }
}

exports.dropPointCreateDroppoint = async function (req, res) {
    let userId = "'" + req.body.userId + "'"
    let longitude = "'" + req.body.longitude + "'"
    let latitude = "'" + req.body.latitude + "'"
    pool.query('INSERT INTO "Droppoints" ("UserId", "longitude", "latitude", "createdAt", "updatedAt") VALUES (' + userId + ',' + longitude + ',' + latitude + ', current_timestamp, current_timestamp) RETURNING id', (err, results) => {
        if (err) {
            throw err;
        }
        return res.status(200).send(response.response(
            {
                id: results.rows[0]["id"]
            }
        ))
    }
    )


}

exports.getDroppointsByUser = async (req, res) => {
    droppoints = await req.user.getDroppoints();
    return res.status(200).send(response.response(droppoints, 'Droppoints fetched!', 200));
}