import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import cookieConfig from "../../config/cookieConfig.js";
import { getAccessToken, getRefreshToken } from "../../methods/jwtCreation.js";
import User from "../../models/User.js";

export default async function (req, res) {
  try {
    const { googleToken } = req.body;
    const response = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = response.getPayload();
    const { email, picture, name } = payload;

    //Checking if user with email exists
    const foundUser = await User.findOne({ email });

    //If User Does Not Exist
    if (!foundUser) {
      let newUser = new User({
        username: name,
        email,
        pfp: picture,
        verified: email_verified,
      });
      const user = await newUser.save();
      console.log(user);

      const accessToken = getAccessToken({ id: user._id });

      res.cookie("accessToken", "Bearer " + accessToken, cookieConfig);
      return res
        .status(200)
        .json({ success: true, message: "Logged In Successfully!" });
    }

    //If User Exists
    let accessToken = getAccessToken({ id: foundUser._id });
    res.cookie("accessToken", "Bearer " + accessToken, cookieConfig);
    return res.status(200).json({
      success: true,
      message: "Logged In Successfully!",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Internal Server Error" });
  }
}
