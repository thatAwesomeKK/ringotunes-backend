import { createTransport } from "nodemailer";
import Mailgen from 'mailgen';

export const emailVerifyGenerator = async (email, emailVerifytoken, username) => {
    let transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.CLIENT_USER_EMAIL, // generated ethereal user
            pass: process.env.CLIENT_USER_PASSWORD, // generated ethereal password
        },
    })

    let MailGenerator = new Mailgen({
        theme: 'neopolitan',
        product: {
            // Appears in header & footer of e-mails
            name: 'RingoTunes',
            link: `${process.env.CLIENT_URL}`
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    })

    let genEmail = {
        body: {
            name: username,
            intro: 'Welcome to Ringotunes! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Ringotunes, Verify your Email here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify Your Email Address!',
                    link: `${process.env.CLIENT_URL}/verify/email/${emailVerifytoken}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    const emailBody = MailGenerator.generate(genEmail)

    let emailMessage = {
        from: process.env.CLIENT_USER_EMAIL,
        to: email,
        subject: "Verify EMAIL",
        html: emailBody
    }

    try {
        const res = await transporter.sendMail(emailMessage)
        return res
    } catch (error) {
        console.log(error);
        return
    }

}


export const passwordResetEmailGenerator = async (email, username, emailVerifytoken) => {
    let transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.CLIENT_USER_EMAIL, // generated ethereal user
            pass: process.env.CLIENT_USER_PASSWORD, // generated ethereal password
        },
    })

    let MailGenerator = new Mailgen({
        theme: 'cerberus',
        product: {
            // Appears in header & footer of e-mails
            name: 'RingoTunes',
            link: process.env.CLIENT_URL
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    })

    let genEmail = {
        body: {
            name: username,
            intro: 'Welcome to Ringotunes! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Ringotunes, Verify your Email here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify Your Email Address!',
                    link: `${process.env.CLIENT_URL}/profile/reset-password/${emailVerifytoken}`
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    const emailBody = MailGenerator.generate(genEmail)

    let emailMessage = {
        from: process.env.CLIENT_USER_EMAIL,
        to: email,
        subject: "Verify EMAIL",
        html: emailBody
    }

    try {
        const res = await transporter.sendMail(emailMessage)
        return res
    } catch (error) {
        console.log(error);
        return
    }

}
