const environmentalVariables = require('dotenv').config();
const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  module.exports = mailTransporter;