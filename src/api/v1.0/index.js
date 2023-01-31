var express                     = require('express');
var router                      = express.Router();
const cors                      = require('cors');
const passport                  = require('passport');
require('../../../config/passport')(passport);// Require controller modules.
const index_controller          = require("../../controllers/indexController");
var authRouter                  = require('./route/auth');
var roleRoute                   = require('./route/roles');
const auth                      = require("../../../middleware/auth_user");
var registerRoute            = require("./route/register_route");
//======================ENDS IMPORT=================================




//======================ROUTES START=================================
if(process.env.NODE_ENV == "test"){ //for UNIT TESTING
    router.get('/',                             index_controller.index);
    router.use('/register',                     cors(), registerRoute);
}else{
    router.get('/',                         index_controller.index);
    router.use('/register',                 cors(), registerRoute);
    // router.use('/auth',                 cors(), authRouter);
    // router.use('/user',                 cors(), auth, passport.authenticate('jwt', {session: false}), usersRouter);
    // router.use('/role',                 cors(), auth, passport.authenticate('jwt', {session: false}), roleRoute);
    // router.use('/permission',           cors(), auth, passport.authenticate('jwt', {session: false}), permissionRoute);
    
}
//======================ROUTES END=================================
module.exports = router;
