import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const user = await User.findById({ _id: req.verify.id });
        if (!user) {
            return res.status(400).send({ error: "User Does Not Exist" })
        }
        const rings = await Ringtone.find({ likes: { "$in": [user.id] } }).populate({ path: 'uid', model: User, select: 'username' }).select('ringID title thumbnail likes origin downloads createdAt')
        if (!rings) {
            return res.status(400).send({ error: "Rings Does Not Exist" })
        }

        return res.status(200).json({ success: true, message: rings });
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}