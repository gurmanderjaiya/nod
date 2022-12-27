/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1. create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 25,
    auth: {
      user: '5f6da59f970410',
      pass: '51cddbeee85d2f',
    },
    // for gmail activate less secure app option
  });
  //2. define the email options
  const mailOptions = {
    from: 'gurmander <gurmander@hotmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3. actually send the file
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
