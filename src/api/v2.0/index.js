
var express = require('express');
var router = express.Router();
// Require controller modules.
const index_controller = require("../../controllers/indexController");




router.get('/', index_controller.index);


module.exports = router;