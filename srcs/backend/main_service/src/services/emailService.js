const nodemailer = require('nodemailer');
const env = require('../config/env');
const {HttpException} = require('../utils/httpExceptions')

const sendMail =  async ({from,to,subject,text}) =>
{
    try {
        let emailOptions = {
            from,
            to,
            subject,
            text
        }
        console.log("email options ",emailOptions);
        const transporter = nodemailer.createTransport(
            {
                service: "gmail",
                auth : {
                    user: env.USER_EMAIL,
                    pass:env.USER_PASSWORD
                }
            }
        )
        return await transporter.sendMail(emailOptions)
    } 
    catch (error) {
        console.error('Email error:', error)
        throw new HttpException(500,"internal server error");  
    }
}

module.exports = sendMail;