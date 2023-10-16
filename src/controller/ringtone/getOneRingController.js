import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
  const { ringID } = req.params;
  try {
    const ring = await Ringtone.findById({ _id: ringID })
      .populate({ path: "uid", model: User, select: "username pfp" })
      .select("ringID title thumbnail likes origin downloads createdAt");
    return res.status(200).json({ success: true, message: ring });
  } catch (err) {
    return res.status(400).send(err);
  }
}
