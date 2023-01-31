var express             = require('express');
const fs                = require('fs');
const Profile           = require('../../models').Profile;
const User              = require('../../models').User;
const Status            = require('../../models').Status;
const Lga               = require('../../models').Lga;
const State             = require('../../models').State;
const Title             = require('../../models').Title;
const Designation       = require('../../models').Designation;
const Unit              = require('../../models').Unit;
const Department        = require('../../models').Department;
const path              = require('path');
const Sequelize         = require('sequelize');
const config            = require('../../config/config.js');







//##################### THIS CONTAIN FUNCTIONS THAT CAN BE RE-USEABLE ###########
class BaseFunction {
    constructor() {

    }

    //######## success response
    responseSuccess(data = null, success = null, message = null, description = "Operation was successful.", statusCode = 200) {
        return (
            {
                "status": statusCode,
                "success": success,
                "message": message,
                "description": description,
                "data": data,
            }
        );
    }

    //######## error response
    responseError(data = null, success = null, message = null, description = "Operation not successful! An error occurred.", statusCode = 400) {
        return (
            {
                "status": statusCode,
                "success": success,
                "message": message,
                "description": description,
                "error": data,
            }
        );
    }

    //Get user upload path
    uploadPath(userId = null) {
        let getUploadPath = null;
        try{
            if(!isNaN(userId) && (userId))
            {
                getUploadPath = require('path').resolve("src/public/", process.env.UPLOAD_PATH + "/" + userId + "/") + "/";
                //getUploadPath = require('path').join(__dirname, "src/public/" + process.env.UPLOAD_PATH) + "/" + userId + "/";
                return this.responseSuccess(getUploadPath, true, "Get file upload path.", "This returns document upload path", 200);
            }else{
                getUploadPath = require('path').resolve("src/public/", process.env.UPLOAD_PATH + "/" + "document" + "/") + "/";
                return this.responseSuccess(getUploadPath, true, "Get file upload path.", "This returns document upload path", 200);
            }
        }catch(error){
            return this.responseError(error.message, false, "User's document path doesn't exit", "Unable to get path", 400);
        }
    }

    
    //Get user download path
    downloadPath(userId = null) {
        let getDownloadPath = null;
        var conn = this.currentConnection();
        try{
            getDownloadPath = conn.host + ":" + process.env.PORT;
            return this.responseSuccess(getDownloadPath, true, "Document download path", "This returns document download path.", 200);
        }catch(error){
            return this.responseError(error.message, false, "Path doesn't exit", "Unable to get path", 400);
        }
    }
    
  
    //Get Single User
    getOneRecord(userId = 0) {
       User.findOne({ 
            include: [{model: Profile, required: true},],
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'email', 'confirm_email', 'status', 'suspend', 'role_id'],
            where:{id: userId}
        }).then((oneRecord)=>{
            return oneRecord;
        }).catch((error)=>{
            return error.message;   
        });
    }

    rawQueryConnection(){
        // SEQUELIZE DB CONFIG
        var conn = this.currentConnection();
        const sequelize = new Sequelize(conn.database, conn.username, conn.password, {
            host: conn.host,
            dialect: conn.dialect
        });

        return sequelize;
    }


    //Get the current Database connected to
    currentConnection(){
        // You can call it like:
        // var conn = baseFunction.currentConnection(); OR var conn = currentConnection();
        // console.log(conn.database);
        var mode = process.env.NODE_ENV;
        const activeConnection = {
            "database"  : config[mode].database,
            "username"  : config[mode].username,
            "password"  : config[mode].password,
            "host"      : config[mode].host,
            "dialect"   : config[mode].dialect
        }
        return activeConnection;
    }

    //Get All Staff full profile details
    async allStaffProfileDetails(statusID = 1) {
        var results = await Profile.findAll({
            include: [
                {model: User, required: true, attributes: ['id', 'email', 'suspend', 'role_id']},
                {model: Status, required: false, attributes: ['id', 'name', 'color', 'description']},
                {model: State, required: false, attributes: ['id', 'name', 'capital']},
                {model: Lga, required: false, attributes: ['id', 'name']},
                {model: Designation, required: false, attributes: ['id', 'name']},
                {model: Title, required: false, attributes: ['id', 'name']},
                {model: Unit, required: false, attributes: ['id', 'name', 'department_id']},
                {model: Department, required: false, attributes: ['id', 'name']}
            ],
            attributes: {exclude: ['updatedAt']},
            where: {status_id: statusID}
        });
        if(results.length > 0)
        {
            return results;
        }else{
            return results;
        }
        
    }//


    generateToken(length) {
        let result = '';
        //const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characters = '0123456789876543210';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

}
module.exports = BaseFunction;