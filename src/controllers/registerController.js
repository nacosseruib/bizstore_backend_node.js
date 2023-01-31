const express = require('express');
const User = require('../../models').User;
const passport = require('passport');
require('../../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();
const Response = require('../utils/response');
const response = new Response();
const BaseFunction = require('../utils/baseFunction');
const baseFunction = new BaseFunction();
const GmailTransporter = require('../utils/gmailTransporterFunction');
const SendEmailTransporter = new GmailTransporter();
const env = require('dotenv').config();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const Path = require("path");
const Moment = require('moment');
const { check, validationResult } = require('express-validator');
//======================ENDS IMPORT=================================




// CREATE EMAIL - Post Email Address
exports.PostRegisterEmail = (req, res) => {
  let emailAddress = req.body.email;
  const validationErrors = validationResult(req);
  if (emailAddress == '' && !validationErrors.isEmpty()) {
        res.status(400).send(response.responseError(validationErrors.array(), false, "Incorrect email address!", validationErrors.array(), 400));
  } else {
    console.log('validationErrors');
      //check if Email exist
      User.count({ where: { email: emailAddress } }).then((count) => {
        if(count > 0){
          res.status(400).send(response.responseError(error.message, false, "Sorry, Email already exist!", "Unable to create Emaill. Email exist.", 400));
        }else{
          //Create new email/user
          User.create(
            {email: emailAddress}
            ).then((new_email) => {
              let token = baseFunction.generateToken(4); //Generate Verify Token
              //Update token in user's record
              User.update({verify_code: token}, {where: {email: emailAddress}}).then(async _ => {
                //Send verify Token via EMAIL
                try {
                  let getMessage = "Here is your verification token: " + token; 
                  let emailTransporter = await SendEmailTransporter.sendEmailOut(emailAddress, getMessage, "Verification Token");
                } catch (error) {console.log(error.message);}
              }).catch(error => res.status(400).send(response.responseError(error.message, false, "Unable to send verification token!", "Unable to send verification token", 400)));
              res.status(200).send(response.responseSuccess(new_email, true, "Email was created and verification token was sent to your Email", "Email was created successfully and verification token was sent via EMail", 200));
          }).catch((error) => {
              res.status(400).send(response.responseError(error.message, false, "Unable to create email! Try again", "Unable to create email", 400));
          });
        }
      }).catch((error) => {
        res.status(400).send(response.responseError(error.message, false, "Sorry, email already exist!", "Unable to create email. Email already exist.", 400));
      });
    }
};



// CREATE PHONE - Post Phone number
exports.PostRegisterPhone = (req, res) => {
  let phoneNumber = req.body.phone;
  let emailAddress = req.body.email;
  const validationErrors = validationResult(req);
  if (phoneNumber == '' && !validationErrors.isEmpty()) {
        res.status(400).send(response.responseError(validationErrors.array(), false, "Incorrect phone number!", validationErrors.array(), 400));
  } else {
      //check if phone exist
      User.count({ where: { phone: phoneNumber } }).then((count) => {
        if(count > 0){
          res.status(400).send(response.responseError(error.message, false, "Sorry, Phone number already exist!", "Unable to create phone number. Phone number exist.", 400));
        }else{
          User.count({ where: {email: emailAddress} }).then((count) => {
              if(count > 0){
                //update new phone/user
                User.update(
                  {phone: phoneNumber}, 
                  {where: {email: emailAddress}
                }).then(async (updatedRec) => {
                    let token = baseFunction.generateToken(4); //Generate Verify Token
                    //Update token in user's record
                    User.update({verify_code: token}, {where: {email: emailAddress}}).then(async _ => {
                      //Send verify Token via EMAIL
                      try {
                        let getMessage = "Here is your verification token: " + token; 
                        let emailTransporter = await SendEmailTransporter.sendEmailOut(emailAddress, getMessage, "Verification Token");
                      } catch (error) {console.log(error.message);}
                    }).catch(error => res.status(400).send(response.responseError(error.message, false, "Unable to send verification token!", "Unable to send verification token", 400)));
                    let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                    res.status(200).send(response.responseSuccess(userDetails, true, "Phone number was created and verification token was sent to your Email", "Phone number was created successfully and verification token was sent via EMail", 200));
                }).catch((error) => {
                    res.status(400).send(response.responseError(error.message, false, "Unable to create phone number! Try again", "Unable to create phone number", 400));
                });
            }else{
              res.status(400).send(response.responseError(error.message, false, "Unable to create phone number. No Email found", "Unable to create phone number. No Email found", 400));
            }
          }).catch((error) =>{
            res.status(400).send(response.responseError(error.message, false, "Unable to create phone number. No Email found", "Unable to create phone number. No Email found", 400));
          });
        }
      }).catch((error) => {
        res.status(400).send(response.responseError(error.message, false, "Sorry, Phone number already exist!", "Unable to create phone number. Phone number exist.", 400));
      });
    }
};


//CREATE USENAME - Post Username
exports.PostRegisterUsername = (req, res) => {
  let username = req.body.username;
  let emailAddress = req.body.email;
  const validationErrors = validationResult(req);
  if (username == '' && !validationErrors.isEmpty()) {
        res.status(400).send(response.responseError(validationErrors.array(), false, "Incorrect username!", validationErrors.array(), 400));
  } else {
      //check if username exist
      User.count({ where: { username: username } }).then((count) => {
        if(count > 0){
          res.status(400).send(response.responseError(error.message, false, "Sorry, Username already exist!", "Unable to create username. Username exist.", 400));
        }else{
          User.count({ where: {email: emailAddress} }).then((count) => {
              if(count > 0){
                //update new username/user
                User.update(
                  {username: username.toLowerCase()}, 
                  {where: {email: emailAddress}
                }).then(async (updatedRec) => {
                    let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                    res.status(200).send(response.responseSuccess(userDetails, true, "Username was created.", "Username was created successfully", 200));
                }).catch((error) => {
                    res.status(400).send(response.responseError(error.message, false, "Unable to create username! Try again", "Unable to create username", 400));
                });
            }else{
              res.status(400).send(response.responseError(error.message, false, "No Email found", "No Email found", 400));
            }
          }).catch((error) =>{
            res.status(400).send(response.responseError(error.message, false, "No Email found", "No Email found", 400));
          });
        }
      }).catch((error) => {
        res.status(400).send(response.responseError(error.message, false, "Sorry, username already exist!", "Uername already exist.", 400));
      });
    }
};


//CREATE PASSWORD - Post Password
exports.PostRegisterPassword = (req, res) => {
  let password = req.body.password;
  let emailAddress = req.body.email;
  const validationErrors = validationResult(req);
  if (password == '' && !validationErrors.isEmpty()) {
        res.status(400).send(response.responseError(validationErrors.array(), false, "Enter password!", validationErrors.array(), 400));
  } else {
      User.count({ where: {email: emailAddress} }).then((count) => {
        if(count > 0){
            //update new password/user
            let hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            User.update(
              {password: hashPassword}, 
              {where: {email: emailAddress}
            }).then(async (updatedRec) => {
                let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                res.status(200).send(response.responseSuccess(userDetails, true, "password was created.", "password was created successfully", 200));
            }).catch((error) => {
                res.status(400).send(response.responseError(error.message, false, "Unable to create password! Try again", "Unable to create password", 400));
            });
        }else{
            res.status(400).send(response.responseError(error.message, false, "No Email found", "No Email found", 400));
        }
      }).catch((error) =>{
            res.status(400).send(response.responseError(error.message, false, "No Email found", "No Email found", 400));
      });
        
    }
};


//CREATE USER DETAILS - Post Names, Gender
exports.PostRegisterInformation = (req, res) => {
  let firstname = req.body.first_name;
  let lastname = req.body.last_name;
  let gender = req.body.gender;
  let emailAddress = req.body.email;
  if (firstname == '' || lastname == '' || gender == '' ) {
        res.status(400).send(response.responseError([], false, "Enter names and gender!", "Enter first name, last name, and gender", 400));
  } else {
      User.count({ where: {email: emailAddress} }).then((count) => {
        if(count > 0){
            //update new names/user
            User.update(
              {
                first_name: firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(), 
                last_name: lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(), 
                gender: gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
              }, 
              {where: {email: emailAddress}}
            ).then(async (updatedRec) => {
                let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                res.status(200).send(response.responseSuccess(userDetails, true, "Your details was created.", "Your details created successfully", 200));
            }).catch((error) => {
                res.status(400).send(response.responseError(error.message, false, "Unable to create details ! Try again", "Unable to create details", 400));
            });
        }else{
            res.status(400).send(response.responseError(error.message, false, "No Email found", "No Email found", 400));
        }
      }).catch((error) =>{
            res.status(400).send(response.responseError(error.message, false, "Unable to create information!", "Unable to create information!", 400));
      });
        
    }
};



//RESEND VERIFY TOKEN
exports.PostRegisterResendToken = (req, res) => {
  let emailAddress = req.body.email;
  const validationErrors = validationResult(req);
  if (emailAddress && !validationErrors.isEmpty()) {
        res.status(400).send(response.responseError(validationErrors.array(), false, "Incorrect email address!", validationErrors.array(), 400));
  } else {
      //check if email exist
        User.count({ where: {email: emailAddress} }).then(async(count) => {
            if(count > 0){
                let token = baseFunction.generateToken(5); //Generate Verify Token
                User.update({verify_code: token}, {where: {email: emailAddress}}).then(async _ => {
                  //Send verify Token via EMAIL
                  try {
                    let getMessage = "Here is your verification token: " + token; 
                    let emailTransporter = await SendEmailTransporter.sendEmailOut(emailAddress, getMessage, "Verification Token");
                  } catch (error) {console.log(error.message);}
                }).catch(error => res.status(400).send(response.responseError(error.message, false, "Unable to resend verification token!", "Unable to resend verification token", 400)));
                let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                res.status(200).send(response.responseSuccess(userDetails, true, "Verification token was sent to your Email", "Verification token was sent to your EMail", 200));
          }else{
              res.status(400).send(response.responseError(error.message, false, "Email does not exist!", "Email does not exist!", 400));
          }
      }).catch((error) =>{
            res.status(400).send(response.responseError(error.message, false, "Email does not exist!", "Email does not exist!", 400));
      });
    }
};


//VERIFY TOKEN
exports.PostRegisterVerifyToken = (req, res) => {
  let phoneNumber = req.body.phone;
  let emailAddress = req.body.email;
  let token = req.body.token;
  let currentDate = new Date();
  const validationErrors = validationResult(req);
  if (token == '' && (phoneNumber == '' || emailAddress == '') && !validationErrors.isEmpty()) {
      var message = 'Some fields are empty!';
      res.status(400).send(response.responseError([], false, message, message, 400))
  } else {
      //update verified Token
      if(phoneNumber != ''){ 
        User.count({ where: {verify_code: token, phone: phoneNumber}}).then((count) => {
            if(count > 0){
              User.update({phone_verified: currentDate}, {where: {verify_code: token, phone: phoneNumber }}).then(async _ => {
                await User.update({verify_code: null}, {where: {phone: phoneNumber}});//clear token
                let userDetails = await User.findOne({where: {phone: phoneNumber}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
                res.status(201).send(response.responseSuccess(userDetails, true, "Phone number was verified", "Phone number was verified successfully."));
              }).catch(error => res.status(400).send(response.responseError(error.message, false, "Token has expired.", "Token has expired.", 400)));
            }else{
              res.status(400).send(response.responseError(error.message, false, "Phone number does not exist!", "Sorry, Phone number does not exist!", 400));
            }
        }).catch((error) => {
            res.status(400).send(response.responseError(error.message, false, "Unable to verify phone number!", "Unable to verify phone number", 400));
        });
      }else{
        User.count({ where: { verify_code: token, email: emailAddress }}).then((count) => {
          if(count > 0){
            User.update({email_verified: currentDate}, {where: {verify_code: token, email: emailAddress}}).then(async _ => {
              await User.update({verify_code: null}, {where: {email: emailAddress}});//clear token
              let userDetails = await User.findOne({where: {email: emailAddress}}, {attributes: {exclude: ['updatedAt','createdAt','suspend','last_login','current_login','password','role_id']}});//get user
              res.status(201).send(response.responseSuccess(userDetails, true, "Email address was verified", "Email address was verified successfully."));
            }).catch(error => res.status(400).send(response.responseError(error.message, false, "Token has expired.", "Token has expired.", 400)));
          }else{
            res.status(400).send(response.responseError(error.message, false, "Email address does not exist!", "Sorry, email address does not exist!", 400));
          }
        }).catch((error) => {
            res.status(400).send(response.responseError(error.message, false, "Unable to verify email!", "Unable to verify email", 400));
        });
      }
  }
};




















//GET: Create list of user
exports.getCreateUserList = async (req, res) => {
      Profile.findAll({
          include: [
            {model: User, required: true, attributes: ['id', 'email', 'confirm_email', 'suspend', 'role_id']},
            {model: Status, required: false}
          ],
          order: [['createdAt', 'DESC']],
      }).then((users) => {
          console.log(users);
          res.status(200).send(response.responseSuccess(users, true, "List of all users", "Query contains user, role and profile schemas", 200));
      }).catch((error) => {
          console.log(error.message);
          res.status(400).send(
              response.responseError(error.message, false, "Unable to get list of all users")
          );
      });
};


// Get User by ID
exports.getUserById = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'user_get').then((rolePerm) => {
        User
          .findByPk(req.params.userId, {
            include: [{model: Profile, required: true},
              //{model:Role, required: false, attributes: ['id', 'role_name', 'role_description']}
            ],
            attributes: ['id', 'email', 'confirm_email', 'suspend', 'role_id']
          })
          .then((user) => res.status(200).send(response.responseSuccess(user, true, "Get user details", "Get user information", 200)))
          .catch((error) => {
            res.status(400).send(response.responseError(error.message, false, "Unable to get user details", null, 400));
          });
      // }).catch((error) => {
      //   res.status(403).send(error);
      // });
};

// Get all the information of all user {Spouse, Children, Next of Kin, Files}
exports.getUserInformation = async (req, res) => {
  await User.findByPk(req.params.userId, {
    include: [
      {model: Profile, required: true, attributes: ['id', 'first_name','last_name','other_name','file_number','phone','gender','designation_id','title_id','grade','step','department_id','profile_photo_url','signature_url']},
      {model:Role, required: false, attributes: ['id', 'role_name', 'role_description']},
      {model:Children, required: false, attributes: ['id', 'first_name', 'last_name', 'other_name', 'gender','child_photo_url']},
      {model:Spouse, required: false, attributes: ['id', 'first_name', 'last_name', 'other_name', 'gender', 'phone', 'email','spouse_photo_url']},
      {model:NextOfKin, required: false, attributes: ['id', 'first_name', 'last_name', 'other_name', 'gender', 'relationship', 'photo_url']}
    ],
    attributes: ['id', 'email', 'confirm_email', 'suspend', 'role_id']
  })
  .then((user) => res.status(200).send(response.responseSuccess(user, true, "Got user details", "Get user information", 200)))
  .catch((error) => res.status(400).send(response.responseError(error.message, false, "Unable to get user details", null, 400)));
}

// Update a User Email Only
exports.updateUserEmail = (req, res) => {
      if (!req.body.email) {
        res.status(400).send({
          msg: 'Please enter email!'
        })
      } else {

        User.count({ where: { id: req.params.userId } }).then((count) => {
          if (count > 0) {
              User.findByPk(req.params.userId)
              .then((user) => {
                // console.log(1111111, user.email);
                User.update({
                  email: req.body.email || user.email,
                }, {
                  where: {
                    id:  user.id
                  }
                }).then(_ => {
                  res.status(200).send({
                    'message': 'User Email was updated successfully.'
                  });
                }).catch(err => res.status(400).send(err));
              })
              .catch((error) => {
                res.status(400).send(error);
              });
            }
        else {
          res.status(404).send(response.responseError([], false, "user id did not exist", "the user id did not exist", 404));
            } // end else
        }) // end Department.count() method

      } // end else
};

// Update a User Password Only
exports.updateUserPassword = (req, res) => {
      if (!req.body.password || !req.body.new_password || !req.body.confirm_password) {
        res.status(400).send({
          msg: 'Please enter your old password, new password and confirm password!'
        })
      } else {
        User.count({ where: { id: req.params.userId } }).then((count) => {
          if (count > 0) {
              User.findByPk(req.params.userId)
              .then((user) => {
                let validPassword = bcrypt.compareSync(req.body.password, user.password)
                if (validPassword) {
                  let new_password = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10), null);
                  User.update({
                    password: new_password || user.password,
                  }, {
                    where: {
                      id:  user.id
                    }
                  }).then(_ => {
                    res.status(200).send({
                      'message': 'User password was updated successfully.'
                    });
                  }).catch(err => res.status(400).send(err));
                }else {
                  res.status(404).send(response.responseError([], false, "the old password inputed is wrong", "the old password is wrong", 404));
                }

              })
              .catch((error) => {
                res.status(400).send(error);
              });
            }
        else {
              res.status(404).send(response.responseError([], false, "user id did not exist", "the user id did not exist", 404));
            } // end else
        }) // end Department.count() method

      } // end else
};

// Update a User Password Only
exports.updateUserDetail = (req, res) => {
      if (!req.body.last_name || !req.body.email || !req.body.first_name || !req.body.status || !req.body.suspend || !req.body.password || !req.body.other_name || !req.body.new_password) {
        res.status(400).send({
          msg: 'Please enter email, last_name, first_name, other_name, status, suspend, password and new_password.'
        })
      } else {

        User.count({ where: { id: req.params.userId } }).then((count) => {
          if (count > 0) {
              User.findByPk(req.params.userId, {
              })
              .then(async (user) => {
                let validPassword = bcrypt.compareSync(req.body.password, user.password)
               // console.log(1111111, validPassword);
                if (validPassword) {
                  let new_password = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10), null);
                  //console.log(222222222, new_password);
                  //console.log(333333333, user.id);
                  await User.update({
                    password: new_password || user.password,
                    email: req.body.email || user.email,
                    suspend: req.body.suspend || user.suspend,
                    fullname: req.body.first_name + ' '+ req.body.last_name + ' '+ req.body.other_name,
                  }, {
                    where: {
                      id:  user.id
                    }
                  }).then(async () => {
                    await User.findByPk(req.params.userId, {include:Profile}).then( async (userData) => {
                      await Profile.update({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        other_name: req.body.other_name,
                      },{
                        where: {
                          id:  userData.Profile.user_id
                        }
                      });
                      res.status(200).send(response.responseSuccess([], true, "user data was updated successfully.", "user data and user's profile were updated successfully.", 200))
                    }) // Profile.findOne()
                    .catch(err => {
                      res.status(400).send(err);
                    });
                  })
                  .catch(err => {
                    res.status(400).send(response.responseError(err.message, false, "Unable to update user data", null, 400));
                  });
                }else {
                  res.status(404).send(response.responseError([], false, "the old password inputed is wrong", "the old password is wrong", 404));
                }
              })
              .catch((error) => {
                res.status(400).send(error);
              });
            }
        else {
              res.status(404).send(response.responseError([], false, "user not exist", "the user not exist", 404));
            } // end else
        }) // end Department.count() method

      } // end else
};





//################# PROFILE CONTROLLERS

// Storing User Profile Information for Documentation
exports.documentProfile = async (req, res) => {
    const currentDate = Moment(); //Getting current date

    // Validates user ID
    const user = await User.findByPk(req.params.userId,{
      include: Profile
    });

    if(user === null){
      return res.status(400).send(response.responseError(null, false, "Invalid user ID provided", null, 400));
    }

    //validate file number
    if(req.body.file_number && req.body.file_number !== null){
      const isFileNumberExists = await Profile.findOne({
        where: {
          file_number: req.body.file_number
        }
      })

      if(isFileNumberExists !== null){
        return res.status(400).send(response.responseError(null, false, "File number already exists", "The file number provided is already in use by a different staff", 400));
      }
    }


    //########################## EMOLUMENT RECORDING ##################################

    // Passing some data into the request body
    req.body.user_id = user.id; // User ID
    req.body.profile_id = user.Profile.id; // Profile ID
    req.body.year = currentDate.year(); // Year

    const emolument = await Emolument.findOne({
      where: {
        user_id: user.id,
        year: req.body.year
      }
    });

    if(emolument == null){
      // Sending data for emolument documentation
      await Emolument.create(req.body).catch(error => {
        console.log(error.message);
        res.status(400).send(response.responseError(error.message, false, "Unable to push information to emolument history", null, 400))
      })
    }else{
      // Update data for emolument documentation
      await Emolument.update(req.body, {
        where: {
          user_id: user.id,
          year: req.body.year
        }
      }).catch(error => {
        console.log(error.message);
        res.status(400).send(response.responseError(error.message, false, "Unable to push information to emolument history", null, 400))
      })
    }

    //########################## EMOLUMENT RECORDING ENDING ##################################


    //Update user's profile
    await Profile.update(req.body, {
        where : {
            user_id : req.params.userId
        }
    }).then( () => {
        // Updating User status to 2
        Profile.update({ status_id: 2 }, {
          where: {
            user_id: req.params.userId
          }
        })
        .then(() => {
            // Retrieving the updated data
            Profile.findOne( {
              where: {
                user_id: req.params.userId
              }
            } ).then( (profile) => {
              res.status(200).send(response.responseSuccess(profile, true, "User's profile information was stored.", "User's profile documentation was successfull",200))
            } ).catch( (error) => {
              console.log(error.message);
              res.status(400).send(response.responseError(error.message, false, "Unable to retrieve the updated profile detail", null, 400));
            } )
        }).catch(error => res.status(400).send(response.responseError(error.message, false, "Unable to update user status", null, 400)))
    } ).catch( (error) => {
      console.log(error.message);
      res.status(400).send(response.responseError(error.message, false, "Unable to document user", null, 400));
    } )
}
// Get a user profile using the user ID
exports.getUserProfile = async (req, res) => {
  var arrayResult = [];
  const userId = req.params.userId;

  const user =await User.findByPk(userId);

  if(user === null){
    return res.status(400).send(response.responseError(null, false, "Invalid user ID provided", null, 400));
  }else{
    // RAW SQL QUERIES
    const [results, metadata] = await baseFunction.rawQueryConnection().query(
      "SELECT profiles.*, departments.name AS department, designations.name AS designation, titles.name AS title, states.name AS state, lgas.name AS lga, users.email FROM profiles LEFT JOIN departments ON profiles.department_id = departments.id LEFT JOIN designations ON profiles.designation_id = designations.id LEFT JOIN titles ON profiles.title_id = titles.id LEFT JOIN states ON profiles.state_id = states.id LEFT JOIN lgas ON profiles.lga_id = lgas.id LEFT JOIN users ON profiles.user_id = users.id WHERE profiles.user_id = '" + userId + "'"
    );
    await Profile.count({where: {file_number: {[Op.ne]: ""}}}).then((totalRecord)=>{
      totalRecord = totalRecord + 1;
      var companyShortName = process.env.COMPANY_STAFF_NO_FORMAT;
      if(totalRecord > 999)
        {
          fileNo = companyShortName + '0' + totalRecord;
        }else if(totalRecord > 99){
          fileNo = companyShortName + '00' + totalRecord;
        }else{
          fileNo = companyShortName + '000' + totalRecord;
        }
        arrayResult.push({"available_file_number": fileNo}, results);
        res.status(200).send(response.responseSuccess(arrayResult, true, "Retrieved profiles", "Retrived Profile information"));
    }).catch((error) => {
          res.status(400).send(response.responseError(error.message, false, "Unable to Retrieve profiles", "Unable to Retrive Profile information or Unable to Generate Staff File No."));
    });
  }
}

exports.getNewFileNumber = async (req, res) => {
    await Profile.count({where: {file_number: {[Op.ne]: ""}}}).then((totalRecord)=>{
      totalRecord = totalRecord + 1;
      var companyShortName = process.env.COMPANY_STAFF_NO_FORMAT;
      if(totalRecord > 999)
        {
          fileNo = companyShortName + '0' + totalRecord;
        }else if(totalRecord > 99){
          fileNo = companyShortName + '00' + totalRecord;
        }else{
          fileNo = companyShortName + '000' + totalRecord;
        }
        res.status(200).send(response.responseSuccess({'fileNo': fileNo}, true, "New Staff File No", "This is the new staff file number"));
    }).catch((error) => {
          res.status(400).send(response.responseError(error.message, false, "Unable to generate new File No", "Unable to generate new staff file number."));
    });
}


// Delete user profile using the user id
exports.deleteUserProfile = async (req, res) => {
  await Profile.destroy({
    where: {
      user_id: req.params.userId
    }
  }).then(() => {
    res.status(201).send(response.responseSuccess(null, true, "User's profile was deleted.", "User's profile was deleted successfull",201))
  }).catch((error) => {
    console.log(error.message);
    res.status(400).send(response.responseError(error.message, false, "Unable to delete user profile", null, 400));
  })
}
// Get all the registered profiles documented and undocumented
exports.getAllProfiles = async (req, res) => {
  // RAW SQL QUERIES
  const [results, metadata] = await baseFunction.rawQueryConnection().query(
    "SELECT profiles.*, departments.name AS department, designations.name AS designation, titles.name AS title, states.name AS state, lgas.name AS lga, users.email FROM profiles LEFT JOIN departments ON profiles.department_id = departments.id LEFT JOIN designations ON profiles.designation_id = designations.id LEFT JOIN titles ON profiles.title_id = titles.id LEFT JOIN states ON profiles.state_id = states.id LEFT JOIN lgas ON profiles.lga_id = lgas.id LEFT JOIN users ON profiles.user_id = users.id"
  );

  res.status(200).send(response.responseSuccess(results, true, "Retrieved profiles", "Retrived all Profile information", 200))
}


// Get only the documented profiles
exports.getAllDocumentedProfiles = async (req, res) => {
  try{
        const status_id = 2; //status 2-documented, 1-not documented
        const results = await baseFunction.allStaffProfileDetails(status_id);
        if((results !== null))
        {
            res.status(201).send(response.responseSuccess(results, true, "List of all documentted profiles", "This returns the list of all the documented staff."));
        }else{
            res.status(201).send(response.responseSuccess(results, true, "No staff has been documented yet", "You have not documented any staff yet. List of documentated staff will appear here."));
        }
    }catch(error){
        res.status(400).send(response.responseError(error.message, false, "No documented profile found", "Could not find a documentated profile that matches your search", 400));
    }
}


// Search for a staff profile by Name or Filenumber
exports.searchStaffByNameOrFilenumber = async (req, res) => {
  const search = req.body.searchKey;
  // RAW SQL QUERIES
  const [results, metadata] = await baseFunction.rawQueryConnection().query(
    "SELECT profiles.*, departments.name AS department, designations.name AS designation, titles.name AS title, states.name AS state, lgas.name AS lga, users.email FROM profiles LEFT JOIN departments ON profiles.department_id = departments.id LEFT JOIN designations ON profiles.designation_id = designations.id LEFT JOIN titles ON profiles.title_id = titles.id LEFT JOIN states ON profiles.state_id = states.id LEFT JOIN lgas ON profiles.lga_id = lgas.id LEFT JOIN users ON profiles.user_id = users.id  WHERE profiles.first_name LIKE '%" + search + "%' OR profiles.last_name LIKE '%" + search + "%' OR profiles.file_number LIKE '%" + search + "%'"
  );
  res.status(200).send(response.responseSuccess(results, true, "Retrieved profile", "Retrived Profile information", 200));
}

//############## PASSPORT AND SIGNATURE CONTROLLER
// Upload passport and/or signature
exports.uploadPassportAndSignature = async (req, res) => {
  // Initializing required variables
  let passportFileName;  // Uploaded file name for the Passport
  let signatureFileName;  // Uploaded file name for the Signature
  let path1; // Storage path for passport
  let path2; // Storage path for signature
  let rootPath; //root upload path
  let passportPath;
  let signaturePath;
  let downloadPath;
  // let rootPath = __dirname + "../../uploads/documentation/" + req.params.userId + "/";

  // Upload Path Validation
  if(baseFunction.uploadPath(req.params.userId).success){
    //Checking if User Profile exists
    const userProfile = await Profile.findOne( {where: { user_id : req.params.userId }} );

    if(userProfile !== null){
      rootPath = baseFunction.uploadPath(req.params.userId).data;
    }else{
      return res.status(400).send(response.responseError(null, false, "User Id does not exist", "An issue was encounterd when trying to upload file", 400));
    }

  }else{
    const pathErrMssage = baseFunction.uploadPath(req.params.userId).message;
    return res.status(400).send(response.responseError(null, false, pathErrMssage, "An issue was encounterd when trying to upload file", 400));
  }

  // Getting the download path
  if(baseFunction.downloadPath(req.params.userId).success){
    downloadPath = baseFunction.downloadPath(req.params.userId).data;
  }else{
    const pathErrMssage = baseFunction.uploadPath(req.params.userId).message;
    res.status(400).send(response.responseError(null, false, pathErrMssage, "Could not retrieve file path", 400))
  }


  // Doing a check to verify if a file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send(response.responseError(null, false, "No file was sent for upload", null, 400));
  }else{

    if(req.files.passport && req.files.signature){

      const passport = req.files.passport;  //Getting passport file upload
      const signature = req.files.signature;  //Getting the signature file upload

      // Verifying the size of the files
      if (passport.size <= 0 || signature.size <= 0) {
        res.status(400).send(response.responseError(null, false, "Uploaded file has no size, it might be corrupt", null, 400));
      }

      passportFileName = Date.now() + Date.now() + Path.extname(passport.name); //Date.now() + "-" + passport.name; // Passing passport filename
      signatureFileName = Date.now() + Date.now() + Path.extname(signature.name); // Passing signature filename

      //Passport & Signature directory path
      path1 = rootPath +  passportFileName;
      path2 = rootPath +  signatureFileName;

      passportPath = '/' + req.params.userId + '/' + passportFileName;  // Path to be saved to DB
      signaturePath = '/' + req.params.userId + '/' + signatureFileName;

      // Moving the passport
      await passport.mv(path1, (err) => {
        if(err) return res.status(400).send(response.responseError(err, false, "Could not upload passport", "An issue was encounterd when trying to upload passport", 400));

        // Storing passport URL to DB
        Profile.update({ profile_photo_url: passportPath },{
          where: {
            user_id: req.params.userId
          }
        }).catch((error) => {
          res.status(400).send(response.responseError(error, false, "Could not store passport", "An issue was encounterd when trying to store uploaded passport", 400));
        })
      })

      //Moving the signature
      await signature.mv(path2, (err) => {
        if(err) return res.status(400).send(response.responseError(err, false, "Could not upload signatiure", "An issue was encounterd when trying to upload signatiure", 400));

        // Storing signature URL to DB
        Profile.update({ signature_url: signaturePath }, {
          where: {
            user_id: req.params.userId
          }
        }).catch((error) => {
          res.status(400).send(response.responseError(error, false, "Could not store signature", "An issue was encounterd when trying to store uploaded signature", 400));
        })
      })

      // Success Response Data
      const responseData = {
        UploadedFileNames: [req.files.passport.name, req.files.signature.name],
        UploadedFilePath:  [downloadPath+passportPath, downloadPath+signaturePath],
        UploadedFileMimes: [req.files.passport.mimetype, req.files.signature.mimetype],
        UploadedFileSizes: [req.files.passport.size, req.files.signature.size],
        NumberOFilesUploaded: 2
      }

      // Success Response
      res.status(200).send(response.responseSuccess(responseData, true, "Files were uploaded", "User passport and signture uploaded successfull",200))

    }else if(req.files.passport) {

      const passport = req.files.passport;  //Getting passport file upload
      // Verifying the size of the files
      if (passport.size <= 0) {
        res.status(400).send(response.responseError(null, false, "Uploaded file has no size, it might be corrupt", null, 400));
      }else{

        passportFileName = Date.now() + Date.now() + Path.extname(passport.name); // Passing passport filename
        //Passport & Signature directory path
        path1 = rootPath +  passportFileName;

        passportPath = '/' + req.params.userId + '/' + passportFileName; // Path to be saved in D

        // Moving the passport
        await passport.mv(path1, (err) => {
          if(err) return res.status(400).send(response.responseError(err, false, "Could not upload passport", "An issue was encounterd when trying to upload passport", 400));

          // Storing passport URL to DB
          Profile.update({ profile_photo_url: passportPath },{
            where: {
              user_id: req.params.userId
            }
          }).then(() => {
            // Success Response Data
            const responseData = {
              UploadedFileName: req.files.passport.name,
              UploadedFilePath: downloadPath+passportPath,
              UploadedFileMime: req.files.passport.mimetype,
              UploadedFileSize: req.files.passport.size,
              NumberOFilesUploaded: 1
            }
            // Success Response
            res.status(200).send(response.responseSuccess(responseData, true, "Files were uploaded", "User passport uploaded successfull",200))
          })
          .catch((error) => {
            res.status(400).send(response.responseError(error, false, "Could not store passport", "An issue was encounterd when trying to store uploaded passport", 400));
          })
        })

      }



    }else if(req.files.signature){

      const signature = req.files.signature;  //Getting the signature file upload

      // Verifying the size of the files
      if (signature.size <= 0) {
        res.status(400).send(response.responseError(null, false, "Uploaded file has no size, it might be corrupt", null, 400));
      }else{

        signatureFileName = Date.now() + Date.now() + Path.extname(signature.name); // Passing signature filename
        path2 = rootPath +  signatureFileName;

        signaturePath = '/' + req.params.userId + '/' + signatureFileName; // Path to be saved to DB

        //Moving the signature
        await signature.mv(path2, (err) => {
          if(err) return res.status(400).send(response.responseError(err, false, "Could not upload signatiure", "An issue was encounterd when trying to upload signatiure", 400));

          // Storing signature URL to DB
          Profile.update({ signature_url: signaturePath }, {
            where: {
              user_id: req.params.userId
            }
          }).then( () => {
              // Success Response Data
            const responseData = {
              UploadedFileNames: req.files.signature.name,
              UploadedFilePath:  downloadPath+signaturePath,
              UploadedFileMimes: req.files.signature.mimetype,
              UploadedFileSizes: req.files.signature.size,
              NumberOFilesUploaded: 1
            }
            // Success Response
            res.status(200).send(response.responseSuccess(responseData, true, "Files were uploaded", "User signture uploaded successfull",200))
          })
          .catch((error) => {
            res.status(400).send(response.responseError(error, false, "Could not store signature", "An issue was encounterd when trying to store uploaded signature", 400));
          })
        })


      }



    }

  }
}

// Get Passport and/or Signature upload URL for preview
exports.getPassportAndSignatureURL = async (req, res) => {
  let signatiureURL = null;
  let passportURL = null;
  let downloadPath;

  const userProfile = await Profile.findOne( {where: { user_id : req.params.userId }} );
  //Checking if User Profile exists
  if(userProfile === null){
    return res.status(400).send(response.responseError(null, false, "User Id does not exist", null, 400));
  }else{

    // Getting the download path
    if(baseFunction.downloadPath(req.params.userId).success){
      downloadPath = baseFunction.downloadPath(req.params.userId).data;
    }else{
      const pathErrMssage = baseFunction.uploadPath(req.params.userId).message;
      res.status(400).send(response.responseError(null, false, pathErrMssage, "Could not retrieve file path", 400))
    }

    // Complete path to file
    signatiureURL = downloadPath + userProfile.signature_url;
    passportURL =  downloadPath + userProfile.profile_photo_url;

    // Response
    const responseData = {
      signature: signatiureURL,
      passport: passportURL
    }
    res.status(200).send(response.responseSuccess(responseData, true, "Passport and Signature retrieved", "User passport and signture retrieved successfull",200))
  }
}
