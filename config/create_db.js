var express   = require('express'); //Framwork
var app       = express(); //init framework
const mysql   = require("mysql2");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];



let db_con = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    multipleStatements: true // this allow you to run multiple queries at once.
});

db_con.connect(function(err) {
    if (err) throw err;
    db_con.query("CREATE DATABASE " + config.database, function (err, result) {
      if (err){
        console.log("Connected to Database");
      }else{
        console.log("Database created - " + result);
      } 
    });
});
module.exports = db_con;