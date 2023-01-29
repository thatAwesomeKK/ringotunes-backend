import bcrypt from 'bcryptjs'
import cookieConfig from '../../config/cookieConfig.js';
import { getAccessToken, getRefreshToken } from '../../methods/jwtCreation.js';
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { email, password } = req.body

        //Checking if user with email exists
        let foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }
   
        if (!foundUser.password) {
            return res.status(400).json({ success: false, error: 'Login with External Provider' })
        }
        const passwordCompare = await bcrypt.compare(password, foundUser.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }

        const accessToken = getAccessToken({ id: foundUser._id });
        const refreshToken = getRefreshToken({ id: foundUser._id });

        //setting refreshToken in Cookie
        res.cookie("refreshToken", refreshToken, cookieConfig);
        return res.status(200).json({ success: true, message: 'Logged In Successfully!', accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Internal Server Error' })
    }
}