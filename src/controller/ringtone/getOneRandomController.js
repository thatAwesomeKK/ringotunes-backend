import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const aggRing = await Ringtone.aggregate([{ $sample: { size: 1 } }])
        const ring = await Ringtone.populate(aggRing, { path: 'uid', model: User, select: 'username pfp' })

        return res.status(200).json(ring);
    } catch (err) {
        return res.status(400).send(err)
    }
}