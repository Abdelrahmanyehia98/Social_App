import nodemailer from 'nodemailer';
import { IEmailArgument } from "../../Common";
import { EventEmitter } from "node:events";

export const sendEmail = async (
    {
        to,
        cc ,
        subject,
        content,
        attachments = []
    }: IEmailArgument
) => { 
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
    });


    const info = await transporter.sendMail({
        from: `No-reply < ${process.env.USER_EMAIL}>`,
        to,
        cc,
        subject,
        html: content,
        attachments: []
    })
    return info
}

 
export const localEmitter = new EventEmitter()

localEmitter.on('sendEmail', (args:IEmailArgument) => {
    console.log('the sending Email event is started');
    sendEmail(args)
}) 