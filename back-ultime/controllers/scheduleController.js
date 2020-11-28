const db = require("../config/posgres");

exports.create = async (req, res, next) => {
  var sql = 'INSERT INTO public."Schedule" (fk_user,semester) VALUES ($1, $2)';
  let schedule = {
    fk_user: req.body.fk_user,
    semester: req.body.semester,
  };

  await db.query(sql, [schedule.fk_user, schedule.semester]);
  res.send("Schedule created");
};

exports.getByUser = async (req, res, next) => {
  var sql = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';

  let schedule = {
    fk_user: req.body.fk_user,
  };

  await db.query(sql, [schedule.fk_user]);
};
