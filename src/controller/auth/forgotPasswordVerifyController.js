import { getTempToken } from "../../methods/jwtCreation.js";
import User from "../../models/User.js";


export default async function (req, res) {
    try {
        const foundUser = await User.findById({ _id: req.verify.id });
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "User Not Found!" })
        }

        return res.status(200).json({
            success: true, message: "You can now Change Your Password!", tempToken: getTempToken({ id: foundUser._id })
        })
    } catch (error) {
        return res.status(400).json({ success: false, error: "Internal Server Error" })
    }
}