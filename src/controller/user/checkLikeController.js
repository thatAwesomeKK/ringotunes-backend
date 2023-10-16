import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function(req, res){
    try {
        const user = await User.findById({ _id: req.verify.id });
        const { docId } = req.body

        const ring = await Ringtone.findById({ _id: docId })

        if (ring.likes.includes(user.id)) {
            return res.status(200).json({ success: true, error: "Has Liked!" });
        }
        return res.status(200).json({ success: false, error: "Not Liked!" });
    } catch (err) {
        return res.status(400).send({ success: false, error: "Not Liked" })
    }
}