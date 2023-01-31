const express       = require('express');
const router        = express.Router();
const cors          = require('cors');
const passport      = require('passport');
require('../../../../config/passport')(passport);
const auth_controller = require("../../../controllers/authController")
const auth          = require("../../../../middleware/auth_user");



router.post('/register',        auth_controller.register);
router.post('/login',           auth_controller.login);
router.get('/logout',           auth_controller.logout);



module.exports = router;