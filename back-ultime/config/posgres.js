const { Pool } = require("pg");

// const config = {
//   database: 'd6ord6sgl2kbmp',
//   host: 'ec2-52-203-165-126.compute-1.amazonaws.com',
//   user: "yaxevrjtpadvbh",
//   password: "376b027e6dc9d547bb6901cd93f08ad82941ce2b2add905d7150aabe6b7a3145",
//   // this object will be passed to the TLSSocket constructor
//   ssl:true
// }

const connection = new Pool({
  host: "localhost",
  user: "postgres",
  password: "posgrest",
  database: "ULTIME",
  port: "5432",
});
module.exports = connection;
