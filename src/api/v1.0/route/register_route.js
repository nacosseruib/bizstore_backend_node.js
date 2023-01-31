const express               = require('express');
const router                = express.Router();
const register_controller   = require("../../../controllers/registerController");
const {ValidatePhone, ValidateEmail, ValidateVerificationToken, ValidateUsername, ValidatePassword} = require('../../../../middleware/requestValidator');
//======================ENDS IMPORT=================================


router.post('/phone',               ValidatePhone, register_controller.PostRegisterPhone);
router.post('/email',               ValidateEmail, register_controller.PostRegisterEmail);
router.post('/verify-token',        ValidateVerificationToken, register_controller.PostRegisterVerifyToken);
router.post('/resend-token',        ValidateEmail, register_controller.PostRegisterResendToken);
router.post('/username',            ValidateUsername, register_controller.PostRegisterUsername);
router.post('/password',            ValidatePassword, register_controller.PostRegisterPassword);
router.post('/information',         register_controller.PostRegisterInformation);


module.exports = router;