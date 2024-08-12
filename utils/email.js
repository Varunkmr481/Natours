const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {

    // mail Options
    constructor(user, url) {
        (this.to = user.email),
        (this.firstName = user.name.split(' ')[0]),
        (this.url = url),
        (this.from = `Varun Kumar <${process.env.EMAIL_FROM}>`);
    }

    // real emails using sendGrid => production || test emails using mailtrap => development
    newTransport() {
        // sendGrid
        if (process.env.NODE_ENV === 'production') {
        return 1;
        }

        // mailtrap
        return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        });
    }

    // Send the actual email
    async send(template, subject){
        // 1. Render the HTML based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName : this.firstName,
            url : this.url,
            subject : subject
        });

        // 2. Define the email Optiions
        const mailOptions = {
            from : this.from,
            to : this.to,
            subject : subject,
            html : html,
            text : htmlToText.fromString(html)
        }

        // 3. Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome(){  
        await this.send('welcome', "Welcome to the Natours Family!")
    }
};


