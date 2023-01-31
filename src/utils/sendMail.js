// "use strict";
// const nodemailer = require("nodemailer");


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//        type: 'OAuth2',
//        user: process.env.SENDER_EMAIL,
//        pass: process.env.GMAIL_PASSWORD,
//        clientId: process.env.OAUTH_CLIENT_ID,
//        clientSecret: process.env.OAUTH_CLIENT_SECRET,
//        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//     }
//  });

//  let mailOptions = {
//     from: "your gmail address",
//     to: "your recipient email address",
//     subject: "e-mail subject",
//     text: "e-mail body",
//   };

//   transporter.sendMail(mailOptions, function(err, data) {
//     if (err) {
//        console.log("Error: " + err);
//     } else {
//        console.log("Email sent successfully");
//     }
//  });






//  // Route to handle sending mails
// app.post("/send_email", (req, res) => {
//     attachmentUpload(req, res, async function (error) {
//       if (error) {
//         return res.send("Error uploading file");
//       } else {
//         // Pulling out the form data from the request body
//         const recipient = req.body.email;
//         const mailSubject = req.body.subject;
//         const mailBody = req.body.message;
//         const attachmentPath = req.file?.path;
  
//         // Mail options
//         let mailOptions = {
//           from: process.env.SENDER_EMAIL,
//           to: recipient,
//           subject: mailSubject,
//           text: mailBody,
//           attachments: [
//             {
//               path: attachmentPath,
//             },
//           ],
//         };
  
//         try {
//           // Get response from the createTransport
//           let emailTransporter = await createTransporter();
  
//           // Send email
//           emailTransporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//               // failed block
//               console.log(error);
//             } else {
//               // Success block
//               console.log("Email sent: " + info.response);
//               return res.redirect("/success.html");
//             }
//           });
//         } catch (error) {
//           return console.log(error);
//         }
//       }
//     });
//   });