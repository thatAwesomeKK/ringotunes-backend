import Ringtone from "../../models/Ringtone.js";

export default async function (req, res) {
    try {
        const user = req.user
        const { docId } = req.body

        const ring = await Ringtone.findById(docId)

        if (ring.likes.includes(user.id)) {
            await Ringtone.findOneAndUpdate({ _id: docId }, {
                $pull: {
                    likes: user.id
                }
            })
        } else {
            await Ringtone.findOneAndUpdate({ _id: docId }, {
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