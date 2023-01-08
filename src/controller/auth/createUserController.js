import { emailVerifyGenerator } from '../../methods/createEmail.js';
import { getEmailVerifyToken } from '../../methods/jwtCreation.js';
import bcrypt from 'bcryptjs'
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { username, email, password } = req.body

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: 'A User with this Email already exists' })
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
        await emailVerifyGenerator(email, emailVerifytoken, username)

        return res.status(200).json({ success: true, message: "Verify Your Email!" });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Internal Server Error' })
    }
}