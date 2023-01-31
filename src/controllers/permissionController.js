const express = require('express');
const router = express.Router();
const Permission = require('../../models').Permission;
const passport = require('passport');
require('../../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();


//Create New Permission
exports.createNewPermission = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'permissions_add').then((rolePerm) => {
        if (!req.body.permission_name || !req.body.permission_description) {
            res.status(400).send({
                msg: 'Please enter permission name or description.'
            })
        } else {
            Permission
                .create({
                    permission_name: req.body.permission_name,
                    permission_description: req.body.permission_description
                })
                .then((perm) => res.status(201).send(perm))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                });
        }
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};


// Get List of permissions
exports.listAllPermission = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'permissions_get_all').then((rolePerm) => {
        Permission
            .findAll()
            .then((perms) => res.status(200).send(perms))
            .catch((error) => {
                res.status(400).send(error);
            });
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};


// Update a permission
exports.updateOnePermission = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'permissions_update').then((rolePerm) => {
        if (!req.params.id || !req.body.perm_name || !req.body.perm_description) {
            res.status(400).send({
                msg: 'Please pass permission ID, name or description.'
            })
        } else {
            Permission
                .findByPk(req.params.id)
                .then((perm) => {
                    Permission.update({
                        perm_name: req.body.perm_name || perm.perm_name,
                        perm_description: req.body.perm_description || perm.perm_description
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'permission updated'
                        });
                    }).catch(err => res.status(400).send(err));
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
        }
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};


// Delete a permission
exports.deleteOnePermission = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'permissions_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass permission ID.'
            })
        } else {
            Permission
                .findByPk(req.params.id)
                .then((perm) => {
                    if (perm) {
                        perm.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'permission deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'permission not found'
                        });
                    }
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
        }
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};