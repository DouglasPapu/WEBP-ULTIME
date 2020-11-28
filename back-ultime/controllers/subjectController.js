var moment = require("moment");
const db = require("../config/posgres");

//Validation which allows know if any time is between two hours!
//start_time is the time initial of a subject in the BD
//end_time is the time final of the same subject
function compareToHours(rangeTimeStart, rangeTimeFinal, start_time, end_time) {
  fixStart = moment(start_time, "HH:mm");
  fixFinal = moment(end_time, "HH:mm");
  start = moment(rangeTimeStart, "HH:mm");
  end = moment(rangeTimeFinal, "HH:mm");

  if (fixStart.isBetween(start, end) || fixFinal.isBetween(start, end)) {
    return true;
  } else {
    return false;
  }
}

exports.create = async (req, res, next) => {
  var sql2 = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';
  let schedule = {
    fk_user: req.body.fk_user,
  };

  var validate = await db.query(sql2, [schedule.fk_user]);
  // Validation to get the schedule of the current user.
  if (validate.rowCount !== 0) {
    var sql3 = 'SELECT * FROM public."Subject" WHERE fk_schedule = $1';
    let subject2 = {
      fk_schedule: validate.rows[0].pk_schedule,
    };

    //Validation to get all the subjects programmed by current user
    var validate2 = await db.query(sql3, [subject2.fk_schedule]);

    var subject = {
      fk_schedule: validate.rows[0].pk_schedule,
      sub_name: req.body.sub_name,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      sub_day: req.body.sub_day,
    };
    if (validate2.rowCount === 0) {
      devInit = moment(subject.start_time, "HH:mm");
      devFin = moment(subject.end_time, "HH:mm");
      if (devFin.isBefore(devInit)) {
        res.status(406).send({
          message: "The time final should be greater than time initial",
        });
      } else {
        var sql =
          'INSERT INTO public."Subject" (fk_schedule,sub_name, start_time,end_time,sub_day) VALUES ($1, $2, $3, $4, $5) RETURNING pk_subject';
        var obj2 = await db.query(sql, [
          subject.fk_schedule,
          subject.sub_name,
          subject.start_time,
          subject.end_time,
          subject.sub_day,
        ]);
        var id = obj2.rows[0].pk_subject;
        res.status(200).send({ params: { id } });
      }
    } else {
      devInitial = moment(subject.start_time, "HH:mm");
      devFinal = moment(subject.end_time, "HH:mm");
      if (devFinal.isBefore(devInitial)) {
        res.status(406).send({
          message: "The time final should be greater than time initial",
        });
      } else {
        var isValidToAdd = false;
        var stillIterable = true;
        validate2.rows.forEach((element) => {
          currentTime = moment(subject.start_time, "HH:mm");
          currentFinal = moment(subject.end_time, "HH:mm");
          startTime = moment(element.start_time, "HH:mm");
          endTime = moment(element.end_time, "HH:mm");

          if (
            currentTime.isSame(startTime) &&
            currentFinal.isSame(endTime) &&
            subject.sub_day === element.sub_day &&
            stillIterable
          ) {
            stillIterable = false;
            res.status(406).send({ message: "This field is busy" });
          } else {
            if (
              (currentTime.isBetween(startTime, endTime) ||
                currentFinal.isBetween(startTime, endTime)) &&
              subject.sub_day === element.sub_day &&
              stillIterable
            ) {
              stillIterable = false;
              res.status(406).send({ message: "This field is busy" });
            } else {
              if (
                compareToHours(
                  subject.start_time,
                  subject.end_time,
                  element.start_time,
                  element.end_time
                ) &&
                subject.sub_day === element.sub_day &&
                stillIterable
              ) {
                stillIterable = false;
                res
                  .status(406)
                  .send({ message: "Exist some field which is busy" });
              } else {
                isValidToAdd = true;
              }
            }
          }
        });
      }
      if (isValidToAdd && stillIterable) {
        var sqlFinal =
          'INSERT INTO public."Subject" (fk_schedule,sub_name, start_time,end_time,sub_day) VALUES ($1, $2, $3, $4, $5) RETURNING pk_subject';
        var obj = await db.query(sqlFinal, [
          subject.fk_schedule,
          subject.sub_name,
          subject.start_time,
          subject.end_time,
          subject.sub_day,
        ]);
        var id = obj.rows[0].pk_subject;
        res.status(200).send({ params: { id } });
      }
    }
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};

exports.get = async (req, res, next) => {
  var sql2 = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';

  let schedule = {
    fk_user: req.query.fk_user,
  };

  var validate = await db.query(sql2, [schedule.fk_user]);
  // Validation to get the schedule of the current user.
  if (validate.rowCount !== 0) {
    var sql3 = 'SELECT * FROM public."Subject" WHERE fk_schedule = $1';
    let subject2 = {
      fk_schedule: validate.rows[0].pk_schedule,
    };
    var validate2 = await db.query(sql3, [subject2.fk_schedule]);
    res.send(validate2.rows);
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};

exports.delete = async (req, res, next) => {
  var sql2 = 'SELECT pk_schedule FROM public."Schedule" WHERE fk_user = $1';

  let schedule = {
    fk_user: req.query.fk_user,
  };

  var validate = await db.query(sql2, [schedule.fk_user]);
  // Validation to get the schedule of the current user.
  if (validate.rowCount !== 0) {
    var sql3 =
      'DELETE FROM public."Subject" WHERE fk_schedule = $1 AND pk_subject = $2';
    let subject2 = {
      fk_schedule: validate.rows[0].pk_schedule,
      pk_subject: req.query.id,
    };
    await db.query(sql3, [subject2.fk_schedule, subject2.pk_subject]);
    res.status(200).send("Subject successful removed");
  } else {
    res.status(406).send({ message: "The user doesn't exist" });
  }
};
