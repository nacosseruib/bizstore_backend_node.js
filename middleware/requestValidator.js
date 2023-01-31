const express = require('express');
const { check, validationResult } = require('express-validator');


     // Check phone
    var ValidatePhone = [
        check('phone', 'Enter valid phone number').isLength({ min: 7 })
        .withMessage('Phone number must be at least 7 characters')
        .trim()
    ];

     // Check email
    var ValidateEmail = [
        check('email', 'enter a valid email address').isEmail()
        .trim().escape().normalizeEmail(),
    ];

    // Check usename
    var ValidateUsername = [
        check('username', 'Username Must Be an Email Address').isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters')
        .trim()
    ];

    // Check password
    var ValidatePassword = [
        check('password').isLength({ min: 8 })
        .withMessage('Password Must Be at Least 8 Characters')
        .matches('[0-9]').withMessage('Password Must Contain a Number')
        .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
    ];

    //Verify Email or Phone and token
    var ValidateVerificationToken = [
        check('phone', 'Username Must Be an Email Address').isLength({ min: 7 })
        .withMessage('Phone number must be at least 7 characters')
        // .matches('[0-9]').withMessage('Phone number must contain number')
        // .matches('[A-Z]').withMessage('Phone number must contain letter')
        // .matches('[a-z]').withMessage('Phone number must contain letter')
        .trim(),
        check('email', 'enter a valid email address').isEmail().trim().escape().normalizeEmail(), 
        check('token', 'enter a valid token').trim(), 
    ];
    

    module.exports = {
        ValidatePhone, 
        ValidateEmail, 
        ValidateVerificationToken, 
        ValidateUsername,
        ValidatePassword
    };