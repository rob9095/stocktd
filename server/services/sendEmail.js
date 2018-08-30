require('dotenv').load();
const nodemailer = require('nodemailer');

/*
example synxtax
from: '"Our Code World " <myzoho@zoho.com>', // sender address (who sends)
to: 'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
subject: 'Hello ', // Subject line
text: 'Hello world ', // plaintext body
html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
*/

exports.sendEmail = async ({from, to, subject, text, html}) => {
  return new Promise((resolve,reject) => {
    // Create the transporter with the required configuration for Gmail
    // change the user and pass !
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'noreply@stocktd.com',
            pass: process.env.EMAIL_KEY,
        }
    });

    // setup e-mail data, even with unicode symbols
    const config = {
      from: `"Stocktd " <noreply@stocktd.com>`,
      to,
      subject,
      text,
      html
    };
    console.log(config)

    // send mail with defined transport object
    transporter.sendMail(config, function(error, info){
        if(error){
          reject(error);
          return console.log(error);
        }
        console.log('Message sent');
        resolve(info.response)
    });
  })
}
