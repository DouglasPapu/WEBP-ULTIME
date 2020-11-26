const { Pool } = require("pg");

const connection = new Pool({
  host: "localhost",
  user: "postgres",
  password: "posgrest",
  database: "ULTIME",
  port: "5432",
});
module.exports = connection;
