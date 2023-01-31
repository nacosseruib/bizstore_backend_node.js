const express = require('express');
const User = require('../../models').User;
const Role = require('../../models').Role;
const Permission = require('../../models').Permission;
const passport = require('passport');
require('../../config/passport')(passport);
const Helper = require('../utils/helper');
const helper = new Helper();


//Create new role
exports.createNewRole = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_add').then((rolePerm) => {
        if (!req.body.role_name || !req.body.role_description) {
            res.status(400).send({
                message: 'Please enter Role name or description.'
            })
        } else {
            Role
                .create({
                    role_name: req.body.role_name,
                    role_description: req.body.role_description
                })
                .then((role) => res.status(201).send(role))
                .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                });
        }
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};


//Get list of roles
exports.getRoleList = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_get_all').then((rolePerm) => {
        console.log(rolePerm);
        Role
            .findAll({
                include: [
                    {
                        model: Permission,
                        as: 'permissions',
                    },
                    {
                        model: User,
                        as: 'users',
                    }
                ]
            })
            .then((roles) => res.status(200).send(roles))
            .catch((error) => {
                res.status(400).send(error);
            });
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};


//Get One Role by ID
exports.getOneRole = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_get').then((rolePerm) => {
        Role
        .findByPk(
            req.params.id, {
                include: {
                    model: Permission,
                    as: 'permissions',
                }
            }
        )
        .then((roles) => res.status(200).send(roles))
        .catch((error) => {
            res.status(400).send(error);
        });
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
   
};


//Update one role by ID
exports.updateOneRole = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_update').then((rolePerm) => {
        if (!req.params.id || !req.body.role_name || !req.body.role_description) {
            res.status(400).send({
                msg: 'Please pass Role ID, name or description.'
            })
        } else {
            Role
                .findByPk(req.params.id)
                .then((role) => {
                    Role.update({
                        role_name: req.body.role_name || role.role_name,
                        role_description: req.body.role_description || role.role_description
                    }, {
                        where: {
                            id: req.params.id
                        }
                    }).then(_ => {
                        res.status(200).send({
                            'message': 'Role updated'
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


//Delete one role by ID
exports.deleteOneRole = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_delete').then((rolePerm) => {
        if (!req.params.id) {
            res.status(400).send({
                msg: 'Please pass role ID.'
            })
        } else {
            Role
                .findByPk(req.params.id)
                .then((role) => {
                    if (role) {
                        Role.destroy({
                            where: {
                                id: req.params.id
                            }
                        }).then(_ => {
                            res.status(200).send({
                                'message': 'Role deleted'
                            });
                        }).catch(err => res.status(400).send(err));
                    } else {
                        res.status(404).send({
                            'message': 'Role not found'
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


//Add permission to role
exports.addPermissionToRole = (req, res) => {
    //helper.checkPermission(req.user.role_id, 'role_add').then((rolePerm) => {
        if (!req.body.permissions) {
            res.status(400).send({
                msg: 'Please pass permissions.'
            })
        } else {
            Role
                .findByPk(req.params.id)
                .then((role) => {
                    req.body.permissions.forEach(function (item, index) {
                        Permission
                            .findByPk(item)
                            .then(async (perm) => {
                                await role.addPermissions(perm, {
                                    through: {
                                        selfGranted: false
                                    }
                                });
                            })
                            .catch((error) => {
                                res.status(400).send(error);
                            });
                    });
                    res.status(200).send({
                        'message': 'Permissions added'
                    });
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
        }
    // }).catch((error) => {
    //     res.status(403).send(error);
    // });
};