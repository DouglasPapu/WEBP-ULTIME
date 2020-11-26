const db = require("../config/posgres");

exports.create = async (req, res, next) => {
  var sql = 'INSERT INTO public."Schedule" (fk_user,semester) VALUES ($1, $2)';
  let schedule = {
    User_id: req.body.fk_user,
    semester: req.body.semester,
  };

  await db.query(sql, [schedule.User_id, schedule.semester]);
  res.send("Schedule created");
};
