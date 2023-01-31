const express = require('express');
const passport = require('passport');
require('../../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();



// Display welcome note
exports.index = (req, res) => {
    res.send("Welcome to Biztore Backend API");
};