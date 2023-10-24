//Check If the User's Email is Verified
export default async function (req, res, next) {
  try {
    const user = req.user;

    if (!user.verified) {
      return res
        .status(400)
        .json({ success: false, error: "Email Not Verified" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Internal Server Error" });
  }
  next();
}
