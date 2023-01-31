'use strict';
/** @type {import('sequelize-cli').Migration} */
const uuid = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: uuid.v4(),
        allowNull: false,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.DATE
      },
      phone: {
        type: Sequelize.STRING
      },
      phone_verified: {
        type: Sequelize.DATE
      },
      verify_code: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      contact_address: {
        type: Sequelize.TEXT
      },
      profile_photo: {
        type: Sequelize.STRING
      },
      country_code: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE
      },
      current_login: {
        type: Sequelize.DATE
      },
      suspend: {
        type: Sequelize.INTEGER
      }, 
      complete_registration: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};