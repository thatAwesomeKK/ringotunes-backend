import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
  const { docId } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).send({ error: "User Does Not Exist" });
    }

    const ring = await Ringtone.findOneAndUpdate(
      { _id: docId },
      {
        $addToSet: {
          downloads: user.id,
        },
      }
    );
    if (!ring) {
      return res.status(400).send({ error: "Download Unsuccesfull" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Download Successfully!" });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
}
