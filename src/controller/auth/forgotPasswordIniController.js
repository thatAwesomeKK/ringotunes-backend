import { passwordResetEmailGenerator } from "../../methods/createEmail.js";
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
        await passwordResetEmailGenerator(email, username, emailVerifytoken)

        return res.status(200).json({ success: true, message: "Check Mail for Reset Link!" });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: error })
    }
}