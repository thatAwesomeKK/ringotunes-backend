import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
  try {
    const user = req.user
    if (!user) {
      return res.status(400).send({ error: "User Does Not Exist" });
    }
    const rings = await Ringtone.find({ uid: user.id }).select(
      "ringID title thumbnail likes origin downloads createdAt"
    );

    let likesCount = 0;
    rings.forEach((ring) => {
      likesCount += ring.likes.length;
    });

    let downloadsCount = 0;
    rings.forEach((ring) => {
      downloadsCount += ring.downloads.length;
    });

    return res
      .status(200)
      .json({
        success: true,
        message: {
          rings,
          likesCount,
          downloadsCount,
          uid: { pfp: user.pfp, username: user.username },
        },
      });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
}
