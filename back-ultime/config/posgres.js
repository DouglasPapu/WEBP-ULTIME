const { Client, Pool } = require("pg");

const connection = new Pool({
  
  host: "ec2-52-203-165-126.compute-1.amazonaws.com",
  user: "yaxevrjtpadvbh",
  password: "376b027e6dc9d547bb6901cd93f08ad82941ce2b2add905d7150aabe6b7a3145",
  database: "d6ord6sgl2kbmp",
  port: "5432",
  ssl:{ rejectUnauthorized: false },
  dialect: 'postgres',
  dialectOptions: {
    "ssl": {"require":true }
  }
});

module.exports = connection;
