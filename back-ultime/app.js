var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var subjectsRouter = require("./routes/subjects");
var scheduleRouter = require("./routes/schedules");
var gradeRouter = require("./routes/grades");
var plannerRouter = require("./routes/planner");
var tasksRouter = require("./routes/tasks");

var app = express();

app.use(cors());
// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/planner", plannerRouter);
app.use("/api/tasks", tasksRouter);
app.use(cookieParser("hoy es lunes"));
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
