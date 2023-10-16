import cookieConfig from "../../config/cookieConfig.js";
import { getAccessToken, getRefreshToken } from "../../methods/jwtCreation.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const user = await User.findById({ _id: req.verify.id });
        if (!user) {
            res.clearCookie('refreshToken', cookieConfig)
            return res.status(401).json({ success: false });
        }
        const accessToken = getAccessToken({ id: user.id });
        res.cookie("refreshToken", getRefreshToken({ id: user.id }), cookieConfig);
        return res.json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: error })
    }
}