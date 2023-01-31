const express = require('express');
const router = express.Router();
const Role = require('../../../../models').Role;
const Permission = require('../../../../models').Permission;
const passport = require('passport');
require('../../../../config/passport')(passport);

const role_controller = require("../../../controllers/roleController");

// Create a new Role
router.post('/', passport.authenticate('jwt', {session: false}), role_controller.createNewRole);

// Get List of Roles
router.get('/', passport.authenticate('jwt', {session: false}), role_controller.getRoleList);

// Get Role by ID
router.get('/:id', passport.authenticate('jwt', {session: false}), role_controller.getOneRole);

// Update a Role
router.put('/:id', passport.authenticate('jwt', {session: false}), role_controller.updateOneRole);

// Delete a Role
router.delete('/:id', passport.authenticate('jwt', {session: false}), role_controller.deleteOneRole);

// Add Permissions to Role
router.post('/permissions/:id', passport.authenticate('jwt', {session: false}), role_controller.addPermissionToRole);

module.exports = router;