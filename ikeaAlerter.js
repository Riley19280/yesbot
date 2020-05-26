const nodemailer = require('nodemailer');
const rp = require('request-promise');

module.exports.checkIKEA = checkIKEA
module.exports.mailTest = sendMail

function checkIKEA() {
    return rp('https://ikea-status.dong.st/latest.json')
        .then((data) => {
            return JSON.parse(data)
        })
        .then((data) => {
            for(let store of data) {
                if(store.name === 'Charlotte') {
                    let status
                    if (store.last_open && store.last_open > store.last_closed)
                        status = "Open";
                    else if (store.last_closed)
                        status = "Closed";
                    else
                        status = "Unknown";

                    console.log('Charlotte IKEA Status: ' + status)

                    if(status === 'Open') {
                        sendMail()
                    }
                }
            }
        })
}

function sendMail() {
    console.log('Sending IKEA alert mail..')
    let transporter = nodemailer.createTransport({
        host: "smtp.mail.us-east-1.awsapps.com", //
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        },
        debug: true
    });

    let mailOptions = {
        from: 'riley@rileystech.com',
        to: '3162598535@mms.att.net',
        subject: 'Ikea Available',
        text: 'The Charlotte Ikea is open'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}