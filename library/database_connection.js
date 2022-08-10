const mysql = require("mysql");
require("dotenv").config();

// Created to use across multiple files
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

module.exports = con;

// This file allows you to connect to the database and run mysql commands in js
