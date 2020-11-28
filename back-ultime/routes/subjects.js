var express = require("express");
var router = express.Router();
var subject_controller = require("../controllers/subjectController");

/* GET users listing. */
router.post("/create-subject", subject_controller.create);
router.get("/", subject_controller.get);
router.delete("/", subject_controller.delete);
module.exports = router;
