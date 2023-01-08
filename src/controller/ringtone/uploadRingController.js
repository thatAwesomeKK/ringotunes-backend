import cloudinary from "../../config/cloudinary.js";
import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const uploadedFile = req.file
        const { title, origin, image } = req.body
        const user = await User.findById(req.verify.id);
        if (!user) {
            return res.status(403).json({ success: false, error: 'No User Found' });
        }

        const response = await cloudinary.uploader.upload(image, {
            upload_preset: "thumbnail"
        });

        const newRing = new Ringtone({
            ringID: uploadedFile.id,
            uid: user.id,
            title,
            origin,
            thumbnail: response.secure_url,
        })
        await newRing.save()
        return res.status(200).json({ success: true, message: "Ringtone Uploaded Successfully!", ringID: newRing.id })
    } catch (error) {
        return res.status(500).json({ error })
    }
}