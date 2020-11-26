var express = require("express");
var router = express.Router();
var schedule_controller = require("../controllers/scheduleController");

/* GET users listing. */
router.post("/create-schedule", schedule_controller.create);

module.exports = router;
