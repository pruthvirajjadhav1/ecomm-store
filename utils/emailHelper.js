const nodemailer = require('nodemailer');

const mailHelper = async (options)=>{
	let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

	const message = {
	from: 'pruthvirajjadhav1@gmail.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
	}


	await transporter.sendMail(message);

}

module.exports = mailHelper;