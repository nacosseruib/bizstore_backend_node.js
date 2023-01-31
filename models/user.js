'use strict';
const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const uuid = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Role, {
        foreignKey: 'id',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuid.v4(),
      allowNull: false,
      primaryKey: true
    },
    role_id:  {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email_verified: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    phone_verified: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: false
    },
    verify_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    contact_address: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false
    }, 
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    password:  {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: false
    },
    current_login: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: false
    },
    suspend:  {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      defaultValue: 0
    },
    complete_registration:  {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false,
      defaultValue: 0
    },
    
  }, {
    sequelize,
    modelName: 'User',
  });
  //User.beforeCreate(user => user.id = uuid());  //id: uuid.v4(),
  User.beforeSave(async (user, options) => {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });
  User.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
  };
  
  return User;
};