const db = require('../config/posgres')

exports.index = async (req, res, next) =>{
    const response = await db.query('SELECT * FROM public."User"')   
    res.send(response.rows);

  };
exports.create =  async (req, res, next) =>{
    var sql= 'INSERT INTO public."User" (lastname,firstname, passwd,username) VALUES ($1, $2, $3, $4)';
    let user = {       
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        passwd: req.body.passwd,
        username: req.body.username       
      }
    
    await db.query(sql,[user.lastname,user.firstname,user.passwd,user.username])   
    res.send('User created');

  };