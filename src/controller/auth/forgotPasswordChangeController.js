import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

export default async function (req, res) {
    try {
        const { password } = req.body
        const foundUser = await User.findById({ _id: req.verify.id });
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "User Not Found!" })
        }

        const passwordCompare = await bcrypt.compare(password, foundUser.password);
        if(passwordCompare){
            return res.status(400).json({ success: false, error: "You Cannot use the Same Password" })
        }
        
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt);

        let updUser = {}
        updUser.password = secPass
        await User.findByIdAndUpdate({ _id: foundUser._id }, updUser)

        return res.status(200).json({ success: true, message: "Password Changed!" })
    } catch (error) {
        return res.status(400).json({ success: false, error: "Internal Server Error" })
    }
}