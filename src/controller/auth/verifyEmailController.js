import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const foundUser = await User.findById({ _id: req.verify.id });
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "User Not Found!" })
        }
        if (foundUser.verified == true) {
            return res.status(400).json({ success: false, error: "Already Verified!" })
        }

        let updUser = {}
        updUser.verified = true
        await User.findByIdAndUpdate({ _id: foundUser.id }, updUser)

        return res.status(200).json({ success: true, message: "Email Verified!" })
    } catch (error) {
        return res.status(400).json({ success: false, error: "Internal Server Error" })
    }
}