import { OAuth2Client } from 'google-auth-library'
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import cookieConfig from '../../config/cookieConfig.js';
import { getAccessToken, getRefreshToken } from '../../methods/jwtCreation.js';
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { googleToken } = req.body
        const response = await googleClient.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = response.getPayload()
        const { email, picture, name } = payload

        //Checking if user with email exists
        const foundUser = await User.findOne({ email })

        //If User Does Not Exist
        if (!foundUser) {
            let newUser = new User({
                username: name,
                email,
                pfp: picture,
                verified: email_verified
            });
            const user = await newUser.save()
            console.log(user);

            const refreshToken = getRefreshToken({ id: user._id });
            const accessToken = getAccessToken({ id: user._id });

            res.cookie("refreshToken", refreshToken, cookieConfig);
            return res.status(200).json({ success: true, message: 'Logged In Successfully!', accessToken: `Bearer ${accessToken}` });
        }

        //If User Exists
        let refreshToken = getRefreshToken({ id: foundUser._id });
        let accessToken = getAccessToken({ id: foundUser._id });
        res.cookie("refreshToken", refreshToken, cookieConfig);
        return res.status(200).json({ success: true, message: 'Logged In Successfully!', accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Internal Server Error' })
    }
}