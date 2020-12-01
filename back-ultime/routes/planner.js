var express = require("express");
var router = express.Router();
var planner_controller = require('../controllers/plannerController')

router.post("/create-planner", planner_controller.create);

module.exports = router;