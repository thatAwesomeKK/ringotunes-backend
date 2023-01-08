import cloudinary from "../../config/cloudinary.js";
import Ringtone from "../../models/Ringtone.js";

export default async function (req, res) {
    try {
        const { id, title, description, thumbnail } = req.body

        let updRing = {}
        if (title) {
            updRing.title = title
        }
        if (description) {
            updRing.description = description
        }
        if (thumbnail) {
            const response = await cloudinary.uploader.upload(thumbnail);
            updRing.thumbnail = response.secure_url
        }

        await Ringtone.findOneAndUpdate({ _id: id }, updRing)
        return res.status(200).json({ success: true, message: "Successfully Updated!" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Internal Server Error" })
    }
}