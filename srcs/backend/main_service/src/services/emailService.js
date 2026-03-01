import nodemailer from 'nodemailer';
import env from '../config/env.js';
import {HttpException} from '../utils/httpExceptions.js';

const sendMail =  async ({from,to,subject,text}) => {
    try {
        let emailOptions = {
            from,
            to,
            subject,
            text
        }
        console.log(emailOptions);
        const transporter = nodemailer.createTransport({
                service: "gmail",
                auth : {
                    user: env.USER_EMAIL,
                    pass:env.USER_PASSWORD
                }
            })
        return await transporter.sendMail(emailOptions)
    } 
    catch (error) {
        throw new HttpException(500,"internal server error");  
    }
}

export default  sendMail;