import bcrypt from 'bcryptjs'
import cookieConfig from '../../config/cookieConfig.js';
import { getAccessToken, getRefreshToken } from '../../methods/jwtCreation.js';
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { email, password } = req.body
        console.log(email, password);
        //Checking if user with email exists
        let foundUser = await User.findOne({ email })
        console.log(foundUser);
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, foundUser.password);
        console.log(passwordCompare);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }

        let accessToken = getAccessToken({ id: foundUser._id });

        //generating refresh token
        let refreshToken = getRefreshToken({ id: foundUser._id });

        //setting refreshToken in Cookie
        res.cookie("refreshToken", refreshToken, cookieConfig);
        return res.status(200).json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Internal Server Error' })
    }
}