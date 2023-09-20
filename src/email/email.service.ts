import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
    private readonly transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "70c2f8df4bb645",
                pass: "717b2046a9dbae"
            },
        });
    }
    async sendWelcomeMail(too: string) {
        const mailOptions = {
            from: '1rn19ec116.rikill@gmail.com',
            to: 'krikhil137@gmail.com',
            subject: 'Thanks for registering with us',
            text: 'Welcome to WhatsApp-Clone!!! We are glad to have you onboard'

        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log("welcome mail sent");
        } catch (err) {
            console.error("error sending mail:", err)
        }
    }
}
