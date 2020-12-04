var express = require("express");
var router = express.Router();
var grade_controller = require("../controllers/gradeController");

router.post("/", grade_controller.create);
router.get("/", grade_controller.get);
router.post("/calculate", grade_controller.calculate);
router.delete("/", grade_controller.delete);
router.put("/", grade_controller.update);
module.exports = router;
