import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    const { uid } = req.params

    try {
        const user = await User.findById({ _id: uid });
        if (!user) {
            return res.status(400).send({ error: "User Does Not Exist" })
        }

        const ring = await Ringtone.find({ uid: user.id }).select('ringID title thumbnail likes origin downloads createdAt')

        let likesCount = 0;
        ring.forEach((ring) => {
            likesCount += ring.likes.length
        })
        return res.status(200).json({ rings: ring, likesCount, uid: { pfp: user.pfp, username: user.username } });
    } catch (err) {
        return res.status(400).send({ error: err })
    }
}