import cookieConfig from "../../config/cookieConfig.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        let user = await User.findById({ _id: req.verify.id });
        if (!user) {
            res.clearCookie('refreshToken', cookieConfig)
            return res.status(200).json({ success: true });
        }
        res.clearCookie('refreshToken', cookieConfig)
        return res.status(200).json({ success: true, message: 'Logged Out SuccessFully!' });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}