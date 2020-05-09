var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fetch = require("node-fetch");
var cron = require("node-cron");

var schedulerCron = require(('./cron/schedulerCron'));

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user/user');
var notificationRouter = require('./routes/notification/notification');
var mapsRouter = require('./routes/maps');
var itemsRouter = require('./routes/items');
var deliveriesRouter = require('./routes/deliveries');
var dropPointRouter = require('./routes/droppoint');
var warehouseRouter = require('./routes/warehouse/warehouse');
var requestRouter = require('./routes/request/request');
var requestLineRouter = require('./routes/requestline/requestline');

var app = express();

app.set('view engine', 'pug')

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

cron.schedule('* * * *  *', schedulerCron.scheduler);

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/notification', notificationRouter);
app.use('/route', mapsRouter);
app.use('/items', itemsRouter);
app.use('/deliveries', deliveriesRouter);
app.use('/droppoint', dropPointRouter);
app.use('/warehouse', warehouseRouter);
app.use('/request', requestRouter);
app.use('/requestline', requestLineRouter);

module.exports = app;
