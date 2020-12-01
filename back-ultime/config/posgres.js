const { Pool } = require("pg");

const connection = new Pool({
  host: "localhost",
  user: "postgres",
  password: "juanmar1709",
  database: "Web",
  port: "5432",
});
module.exports = connection;
