import User from "../models/User.js";

export default async function (req, res, next) {
    try {
        const user = await User.findById({ _id: req.verify.id });
        if (!user.verified) {
            return res.status(400).json({ success: false, error: "Email Not Verified" })
        }
        next()
    } catch (error) {
        return res.status(400).json({ success: false, error: "Internal Server Error" })
    }

}