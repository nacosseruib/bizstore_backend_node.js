const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../../../config/passport')(passport);
const permission_controller = require("../../../controllers/permissionController");


// Create a new permission
router.post('/', passport.authenticate('jwt', {session: false}), permission_controller.createNewPermission);

// Get List of permissions
router.get('/', passport.authenticate('jwt', {session: false}), permission_controller.listAllPermission);

// Update a permission
router.put('/:id', passport.authenticate('jwt', {session: false}), permission_controller.updateOnePermission);

// Delete a permission
router.delete('/:id', passport.authenticate('jwt', {session: false}), permission_controller.deleteOnePermission);


module.exports = router;

// Delete a permission
// router.delete('/:id', passport.authenticate('jwt', {
//     session: false
// }), function (req, res) {
//     helper.checkPermission(req.user.role_id, 'permissions_delete').then((rolePerm) => {
//         if (!req.params.id) {
//             res.status(400).send({
//                 msg: 'Please pass permission ID.'
//             })
//         } else {
//             Permission
//                 .findByPk(req.params.id)
//                 .then((perm) => {
//                     if (perm) {
//                         perm.destroy({
//                             where: {
//                                 id: req.params.id
//                             }
//                         }).then(_ => {
//                             res.status(200).send({
//                                 'message': 'permission deleted'
//                             });
//                         }).catch(err => res.status(400).send(err));
//                     } else {
//                         res.status(404).send({
//                             'message': 'permission not found'
//                         });
//                     }
//                 })
//                 .catch((error) => {
//                     res.status(400).send(error);
//                 });
//         }
//     }).catch((error) => {
//         res.status(403).send(error);
//     });
// });
