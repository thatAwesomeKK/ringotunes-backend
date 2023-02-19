import cloudinary from "../../config/cloudinary.js";
import User from "../../models/User.js";


export default async function (req, res) {
    try {
        const { pfp, username } = req.body
        let user = await User.findById({ _id: req.verify.id });
        if (!user) {
            return res.status(401).json({ success: false });
        }
        let updUser = {}
        if (pfp) {
            const response = await cloudinary.uploader.upload(pfp, {
                upload_preset: "pfp"
            });
            updUser.pfp = response.secure_url
        }
        if (username) { updUser.username = username }

        await User.findByIdAndUpdate({ _id: user.id }, updUser)

        return res.status(200).json({ success: true, message: "User Updated SuccessFully!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal Server Error!" })
    }
}