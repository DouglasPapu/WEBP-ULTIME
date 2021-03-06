const db = require('../config/posgres')

exports.create = async (req, res, next) => {
    var sql = 'INSERT INTO public."Planner" (fk_user,pl_name) VALUES ($1, $2)';
    let planner = {
        fk_user: req.body.fk_user,
        pl_name: req.body.pl_name,
    };

    await db.query(sql, [planner.fk_user, planner.pl_name]);
    res.send("Planner created");
}