import { emailVerifyGenerator } from '../../methods/createEmail.js';
import { getEmailVerifyToken } from '../../methods/jwtCreation.js';
import bcrypt from 'bcryptjs'
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { username, email, password } = req.body

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, error: 'A User with this Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt);

        const avatarUrl = `https://avatars.dicebear.com/api/adventurer-neutral/${username}.svg`

        let newUser = new User({
            username,
            email,
            pfp: avatarUrl,
            password: secPass,
        });
        await newUser.save()



        const emailVerifytoken = getEmailVerifyToken({ id: newUser._id })
        const genEmail = {
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
        }
        await emailVerifyGenerator(email, genEmail)

        return res.status(200).json({ success: true, message: "Verify Your Email!" });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Internal Server Error' })
    }
}