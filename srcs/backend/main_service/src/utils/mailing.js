const nodemailer = require('nodemailer');
const env = require('../config/env')

const sendingMail =  async ({from,to,subject,message}) =>
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
                    user: env.EMAIL,
                    pass:env.EMAIL_PASS
                }
            }
        )
        return await transporter.sendMail(emailOptions)
    } catch (error) {
        
    }
}