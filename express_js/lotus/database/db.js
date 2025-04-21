const { Pool } = require ("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "lotus",
   // password: "1",
    password: "postgres76555432",
    port: "5432"
});

module.exports = pool