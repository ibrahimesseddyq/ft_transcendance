const nodemailer = require('nodemailer');
const env = require('../config/env');
const {HttpException} = require('../utils/httpExceptions')

const sendMail =  async ({from,to,subject,message}) =>
{
    try {
        let emailOptions = {
            from,
            to,
            subject,
            message
        }
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
        throw new HttpException(500,"oopa something went wrong");  
    }
}

module.exports = sendMail;