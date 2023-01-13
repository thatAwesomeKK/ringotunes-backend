import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        const user = await User.findById(req.verify.id);
        const { docID } = req.body

        const ring = await Ringtone.findById(docID)

        if (ring.likes.includes(user.id)) {
            await Ringtone.findOneAndUpdate({ _id: docID }, {
                $pull: {
                    likes: user.id
                }
            })
        } else {
            await Ringtone.findOneAndUpdate({ _id: docID }, {
                $addToSet: {
                    likes: user.id
                }
            })
        }

        return res.status(200).json({ message: 'Liked!' });
    } catch (err) {
        return res.status(400).send(err)
    }
}