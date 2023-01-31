'use strict';
const userModel = require('../models').User;
const bcrypt = require("bcryptjs");
var { faker } = require('@faker-js/faker');
const uuid = require('uuid');



module.exports = {
    up: async (queryInterface, Sequelize) => {
        let usersData = [];
        for(var i = 1 ; i <= 50; i++){
            let hashPassword = bcrypt.hashSync(process.env.SEED_DEFAULT_PASSWORD, bcrypt.genSaltSync(10), null);
            let newUsers = {
                id: uuid.v4(),
                email: faker.internet.email(faker.name.firstName()).toLowerCase(),
                email_verified: new Date(),
                password: hashPassword, //faker.internet.password(),
                role_id: 1, 
                phone: faker.phone.number('+123 80 ### ### ##'),
                phone_verified: new Date(),
                username: faker.name.middleName(),
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                gender: faker.name.sexType(),
                contact_address: faker.address.streetAddress(),
                profile_photo: faker.internet.avatar(),
                //country_code: 
                complete_registration: 1,
                last_login: new Date(),
                current_login: new Date(),
                suspend: 0,
                createdAt : new Date(), 
                updatedAt : new Date()
            }
            usersData.push(newUsers);
        }
        await queryInterface.bulkInsert(userModel.tableName, usersData);
    },


    async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete(userModel.tableName, null, {});
    }

};
