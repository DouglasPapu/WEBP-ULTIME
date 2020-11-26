const db = require("../config/posgres");

exports.create = async (req, res, next) => {
  var sql =
    'INSERT INTO public."Subject" (fk_schedule,sub_name, start_time,end_time,sub_day) VALUES ($1, $2, $3, $4, $5)';
  let subject = {
    fk_schedule: req.body.fk_schedule,
    sub_name: req.body.sub_name,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    sub_day: req.body.sub_day,
  };

  await db.query(sql, [
    subject.fk_schedule,
    subject.sub_name,
    subject.start_time,
    subject.end_time,
    subject.sub_day,
  ]);
  res.send("Subject created");
};
