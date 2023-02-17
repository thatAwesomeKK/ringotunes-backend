import { createTransport } from "nodemailer";
import Mailgen from 'mailgen';

export const emailVerifyGenerator = async (email, genEmail) => {
    const transporter = createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.CLIENT_USER_EMAIL, // generated ethereal user
            pass: process.env.CLIENT_USER_PASSWORD, // generated ethereal password
        },
    })

    const MailGenerator = new Mailgen({
        theme: 'cerberus',
        product: {
            // Appears in header & footer of e-mails
            name: 'RingoTunes',
            link: `${process.env.CLIENT_URL}`
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    })

    const emailBody = MailGenerator.generate(genEmail)

    let emailMessage = {
        from: process.env.CLIENT_USER_EMAIL,
        to: email,
        subject: "Verify EMAIL",
        html: emailBody
    }

    try {
        return await transporter.sendMail(emailMessage)
    } catch (error) {
        console.log(error);
        return
    }

}
