const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../../config/passport')(passport);
const User = require('../../models').User;
const Role = require('../../models').Role;
const Response = require('../utils/response');
const response = new Response();
const bcrypt = require("bcryptjs");




//Register - As Admin, new user
exports.register = (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username) {
        res.status(400).send({
            message: 'Please enter your email address, username, and password.'
        })
    } else {
        Role.findOne({
            where: {
                role_name: 'admin'
            }
        }).then((role) => {
            console.log(role.id);
            User.create({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                fullname: req.body.fullname,
                role_id: role.id
            })
                .then((user) => {
                    console.log(user);
                    res.status(201).send(response.responseSuccess(user, true, "New user was created successfully.", "New user and user's profile were create successfully."));
                })
                .catch((error) => {
                    console.log(error.message);
                    res.status(400).send(response.responseError(error.message, false, "Unable to create user's profile", "An error occurred when creating user's profile"))
                });
        }).catch((error) => {
            console.log(error.message);
            res.status(400).send(response.responseError(error.message, false, "Unable to create user's profile", "An error occurred when creating user's profile"))
        });
    }
};


//Login as a user
exports.login = async (req, res) => {
    var currentUser = await User.findOne({
        where: {
            email: req.body.email
        },
        attributes: ['id', 'email', 'fullname', 'last_login', 'suspend', 'role_id', 'password']
    });
    if (!currentUser) {
        res.status(401).send(response.responseError([], false, "Authentication failed. Staff not found.", "Authentication failed. Staff not found."));
    } else {
        currentUser.comparePassword(req.body.password, (err, isMatch) => {
            const maxAge = 1;
            if (isMatch && !err) {
                var token = jwt.sign(JSON.parse(JSON.stringify(currentUser)), process.env.LOGIN_SECRET_TOKEN_VALUE, {
                    expiresIn: process.env.LOGIN_SESSION_TIME //parseInt(process.env.LOGIN_SESSION_TIME)
                });
                res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000})
                jwt.verify(token, process.env.LOGIN_SECRET_TOKEN_VALUE, function (err, data) {
                    console.log(err, data);
                });
                var data = {
                    'token': 'JWT ' + token,
                    'user': currentUser
                }
                //Update Last Login and Currect Login
                //code here....
                res.status(201).send(response.responseSuccess(data, true, "Login was successfully.", "Staff login was successfully."));
            } else {
                res.status(401).send(response.responseError([], false, "Authentication failed. Wrong password", "Authentication failed. Unable to login due to wrong password."));
            }
        })
    }

};


//POST: Logout user
exports.logout = async (req, res) => {

    try{
         req.logOut(function(err) {
            res.cookie("jwt", "", { expiresIn: "1" })
            if (err) { 
                res.status(400).send(response.responseError([err.message], false, 'Unable to logout!'));
            }
            res.status(201).send(response.responseSuccess([], true, 'You have logged out successfully.'));
        });
    }catch(error){
        res.status(401).send(response.responseError([], false, 'Your token has expired already.', null, 401));   
    }
};
