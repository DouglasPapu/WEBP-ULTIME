var express = require("express");
var router = express.Router();
var subject_controller = require("../controllers/subjectController");

/* GET users listing. */
router.post("/create-subject", subject_controller.create);

module.exports = router;
