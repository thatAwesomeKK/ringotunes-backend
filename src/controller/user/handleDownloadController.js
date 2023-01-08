import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function(req, res){
    const { docID } = req.body
    try {
        const user = await User.findById({ _id: req.verify.id });
        if (!user) {
            return res.status(400).send({ error: "User Does Not Exist" })
        }

        const ring = await Ringtone.findOneAndUpdate({ _id: docID }, {
            $addToSet: {
                downloads: user.id
            }
        })
        if (!ring) {
            return res.status(400).send({ error: "Ringtone Does Not Exist" })
        }

        return res.status(200).json({ success: true, message: "Download Successfully!" });
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}