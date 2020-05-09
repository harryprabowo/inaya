var express = require('express');
var router = express.Router();
var mapsController = require('../controllers/maps/maps');

router.get('/', mapsController.mapsCreateEndpoint);
router.get('/duration', mapsController.mapsDurationEndpoint)
router.get('/tsp', mapsController.mapsTspEndpoint)
module.exports = router;
