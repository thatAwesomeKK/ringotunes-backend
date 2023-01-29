import { emailVerifyGenerator } from "../../methods/createEmail.js";
import { getForgotPasswordToken } from "../../methods/jwtCreation.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const { username, email } = req.body

        const user = await User.findOne({ username, email });
        if (!user) {
            return res.status(401).json({ success: false, error: "User Does not Exists!" });
        }

        const emailVerifytoken = getForgotPasswordToken({ id: user._id })
        const genEmail = {
            body: {
                name: username,
                intro: 'Forgot Password? Don\'t Worry!.',
                action: {
                    instructions: 'To get started with Resetting your Password, Verify your Email here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Verify Your Email Address!',
                        link: `${process.env.CLIENT_URL}/profile/reset-password/${emailVerifytoken}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }
        await emailVerifyGenerator(email, genEmail)

        return res.status(200).json({ success: true, message: "Check Mail for Reset Link!" });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: error })
    }
}