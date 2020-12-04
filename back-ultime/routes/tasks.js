var express = require("express");
var router = express.Router();
var task_controller = require('../controllers/taskController');

router.post("/create-task", task_controller.create);
router.get("/", task_controller.get);
router.delete("/delete-task", task_controller.delete);
router.put("/update-task", task_controller.update);

module.exports = router;
