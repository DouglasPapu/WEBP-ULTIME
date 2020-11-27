const { Pool } = require("pg");

const connection = new Pool({
  host: "localhost",
  user: "postgres",
  password: "laura123",
  database: "Web",
  port: "5432",
});
module.exports = connection;
