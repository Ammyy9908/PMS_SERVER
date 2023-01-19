"use strict";
const nodemailer = require("nodemailer");
async function sendMail({ to, subject, template, message }) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "sb78639@gmail.com", // generated ethereal user
      pass: "<Password comes here>", // generated ethereal password
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "sb78639@gmail.com", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: template, // html body
    });
    return info.messageId;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = sendMail;
