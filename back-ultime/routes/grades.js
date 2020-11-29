var express = require("express");
var router = express.Router();
var grade_controller = require("../controllers/gradeController");

router.post("/create-grade", grade_controller.create);
router.get("/", grade_controller.get);
router.delete("/", grade_controller.delete);
module.exports = router;
