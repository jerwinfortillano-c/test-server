const mysql = require("mysql");
require("dotenv").config();


//MYSQL CONNECT
const conn = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

conn.connect((error) => {
  if(!error) {
    console.log('connected');
  } else {
    console.log('Connection Failed')
  }
});


module.exports = conn;
