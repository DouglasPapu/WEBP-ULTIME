const db = require('../config/posgres')
var md5 = require('md5')


exports.index = async (req, res, next) =>{
    const response = await db.query('SELECT * FROM public."User"')   
    res.send(response.rows);

  };

exports.create =  async (req, res, next) =>{

  var sqlvalidate= 'SELECT * FROM public."User" WHERE username = $1';
  var validate = db.query(sqlvalidate,[req.body.username])
  
    let user = {       
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        passwd: md5(req.body.passwd),
        username: req.body.username       
      }     
    if(validate !=='Promise { <pending> }'){
      var sql= 'INSERT INTO public."User" (lastname,firstname, passwd,username) VALUES ($1, $2, $3, $4)';
      var response = await db.query(sql,[user.lastname,user.firstname,user.passwd,user.username]) 
      //create a planner
        
      var plannerUser = await db.query('SELECT * FROM public."User" WHERE username = $1',[user.username])
      var planner= 'INSERT INTO public."Planner" (fk_user,pl_name) VALUES ($1, $2)';
      console.log(plannerUser.rows[0].pk_user)
      await db.query(planner, [plannerUser.rows[0].pk_user, 'initPlanner']);

      res.send('User created');
    }else{
      res.send('The username already exists')
    }
   

  };

 exports.login = async (req,res, nex)=> {
 
   var username = req.body.username
   var password = md5(req.body.passwd)  
    var sql = 'SELECT * FROM public."User" WHERE username = $1';
    const response = await db.query(sql, [username]);      
    console.log("ENTRANDO",response.rows[0].username)
    if (username === response.rows[0].username && password === response.rows[0].passwd){
        return res.send('user loged')
    } else{
      return res.send('The users no exists');
    }
    
};