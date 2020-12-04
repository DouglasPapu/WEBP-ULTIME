var moment = require("moment");
const db = require("../config/posgres");

exports.create = async (req, res, next) => {
  var sql = 'SELECT pk_planner FROM public."Planner" WHERE fk_user = $1';
  let planner = {
    fk_user: req.body.fk_user,
  };
  var validate = await db.query(sql, [planner.fk_user]);
  // Validation to get the planner of the current user.
  if (validate.rowCount !== 0) {
    var sql2 = 'SELECT * FROM public."Task" WHERE fk_planner = $1';
    let task1 = {
      fk_planner: validate.rows[0].pk_planner,
    };

    //Validation to get all the tasks programmed by current user
    var validate2 = await db.query(sql2, [task1.fk_planner]);

    var task = {
      fk_planner: validate.rows[0].pk_planner,
      tk_name: req.body.name,
      tk_description: req.body.description,
      start: req.body.start,
      end: req.body.end,
      tk_day: req.body.day,
      tk_done: req.body.done,
      color: req.body.color
    };
    if (validate2.rowCount === 0) {
      devInit = moment(task.start, "HH:mm");
      devFin = moment(task.end, "HH:mm");
      if (devFin.isBefore(devInit)) {
        res.status(406).send({
          message: "The time final should be greater than time initial",
        });
      } else {
        var sql =
          'INSERT INTO public."Task" (fk_planner,tk_name,tk_description, start_time,end_time,tk_day, tk_done, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING pk_task';
        var obj2 = await db.query(sql, [
          task.fk_planner,
          task.tk_name,
          task.tk_description,
          task.start,
          task.end,
          task.tk_day,
          task.tk_done,
          task.color
        ]);
        var id = obj2.rows[0].pk_task;
        res.status(200).send({ params: { id } });
      }
    } else {
      var sqlF =
        'INSERT INTO public."Task" (fk_planner,tk_name,tk_description, start_time,end_time,tk_day, tk_done, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING pk_task';
      var obj = await db.query(sqlF, [
        task.fk_planner,
        task.tk_name,
        task.tk_description,
        task.start,
        task.end,
        task.tk_day,
        task.tk_done,
        task.color
      ]);
      var id = obj.rows[0].pk_task;
      res.status(200).send({ params: { id } });
    }
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};

exports.get = async (req, res, next) => {
  var sql2 = 'SELECT pk_planner FROM public."Planner" WHERE fk_user = $1';

  let planner = {
    fk_user: req.query.fk_user,
  };

  var validate = await db.query(sql2, [planner.fk_user]);
  // Validation to get the planner of the current user.
  if (validate.rowCount !== 0) {
    var sql = 'SELECT * FROM public."Task" WHERE fk_planner = $1';
    let task = {
      fk_planner: validate.rows[0].pk_planner,
    };
    var validate2 = await db.query(sql, [task.fk_planner]);
    res.send(validate2.rows);
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};

exports.delete = async (req, res, next) => {
  var sql2 = 'SELECT pk_planner FROM public."Planner" WHERE fk_user = $1';

  let planner = {
    fk_user: req.query.fk_user,
  };
  var validate = await db.query(sql2, [planner.fk_user]);
  // Validation to get the planner of the current user.
  if (validate.rowCount !== 0) {
    var sql3 =
      'DELETE FROM public."Task" WHERE fk_planner = $1 AND pk_task = $2';
    let task1 = {
      fk_planner: validate.rows[0].pk_planner,
      pk_task: req.query.id,
    };
    await db.query(sql3, [task1.fk_planner, task1.pk_task]);
    res.status(200).send("Task successful removed");
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};

exports.update = async (req, res, next) => {
  var sqlTsk = 'SELECT * FROM public."Task" WHERE pk_task = $1';
  let task1 = {
    pk_task: req.body.id
  }

  var validate2 = await db.query(sqlTsk, [task1.pk_task]);
  if (validate2.rowCount !== 0) {
    var task = {
      pk_task: req.body.id,
      tk_name: req.body.name,
      tk_description: req.body.description,
      start: req.body.start_time,
      end: req.body.end_time,
      tk_day: req.body.day,
      tk_done: req.body.done,
      color: req.body.color
    }
    var sql3 =
      'update public."Task" set tk_name = $1, tk_description = $2, start_time = $3, end_time = $4, tk_day = $5, tk_done = $6, color = $7 where pk_task = $8';

    await db.query(sql3, [task.tk_name, task.tk_description, task.start, task.end, task.tk_day, task.tk_done, task.color, task.pk_task]);
    res.status(200).send("Task successful updated");
  } else {
    console.log(req.body);
    console.log(req.query);
    res.status(406).send({ message: "The task doesn't exist" });
  }
}