var express             = require('express');
const { google }        = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nodemailer = require("nodemailer");
const env = require('dotenv').config();



class GmailTransporterFunction {
    constructor() {}

    async createTransporter() {
        // 1
          const oauth2Client = new OAuth2(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
          );
        
        // 2
          oauth2Client.setCredentials({
            refresh_token: process.env.OAUTH_REFRESH_TOKEN,
          });
        
          const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
              if (err) {
                reject("Failed to create access token :( " + err);
              }
              resolve(token);
            });
          });
        
        // 3
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: process.env.SENDER_EMAIL,
              accessToken,
              clientId: process.env.OAUTH_CLIENT_ID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
          });
        
        // 4
          return transporter;
    };

    getMailOption(emailAddress = "samsontopeajax@gmail.com", message = process.env.SEND_MESSAGE, subject = process.env.SEND_SUBJECT){
        return mailOptions = {
            from: process.env.SEND_FROM,
            to: emailAddress,
            subject: subject,
            text: message,
        };
    };
    
    
    async sendEmailOut(emailAddress = null, message = null, subject = null) 
    {
        if(emailAddress != null){
            try {
                let mailOptions = {
                    from: process.env.SEND_FROM,
                    to: emailAddress,
                    subject: subject,
                    text: message,
                };
                let emailTransporter = await this.createTransporter();
                emailTransporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    return error;
                  } else {
                    return info.response;
                  }
                });
              } catch (error) {
                 return error;
              }
        }
    }
}
module.exports = GmailTransporterFunction;
