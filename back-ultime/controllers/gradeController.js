const db = require("../config/posgres");

exports.get = async (req, res, next) => {
  console.log(req.query);
  var sql2 = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';
  let schedule = {
    fk_user: req.query.fk_user,
  };
  var validate = await db.query(sql2, [schedule.fk_user]);

  if (validate.rowCount === 0) {
    res.status(406).send({ message: "The user doesn't exist" });
  } else {
    var sql3 = 'SELECT * FROM public."Grade" WHERE fk_subject = $1';
    let grade = {
      fk_subject: req.query.fk_subject,
    };
    var validate2 = await db.query(sql3, [grade.fk_subject]);
    res.send(validate2.rows);
  }
};

exports.create = async (req, res, next) => {
  var sql =
    'INSERT INTO public."Grade" (gr_percent, gr_quantity,fk_subject) VALUES ($1, $2, $3) RETURNING pk_grade';
  var subject = {
    gr_percent: req.body.gr_percent,
    gr_quantity: req.body.gr_quantity,
    fk_subject: req.body.fk_subject,
  };
  var obj = await db.query(sql, [
    subject.gr_percent,
    subject.gr_quantity,
    subject.fk_subject,
  ]);
  var id = obj.rows[0].pk_grade;
  res.status(200).send({ params: { id } });
};

exports.delete = async (req, res, next) => {
  var sql2 = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';
  let schedule = {
    fk_user: req.query.fk_user,
  };
  var validate = await db.query(sql2, [schedule.fk_user]);

  if (validate.rowCount === 0) {
    res.status(406).send({ message: "The user doesn't exist" });
  } else {
    var sql3 =
      'DELETE FROM public."Grade" WHERE fk_subject = $1 AND pk_grade = $2';
    let grade = {
      fk_subject: req.query.fk_subject,
      pk_grade: req.query.pk_grade,
    };
    await db.query(sql3, [grade.fk_subject, grade.pk_grade]);
    res.status(200).send("Subject successful removed");
  }
};
