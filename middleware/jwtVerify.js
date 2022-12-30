const jwt = require("jsonwebtoken");
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const cookieConfig = { sameSite: 'none', secure: true, httpOnly: true, domain: process.env.COOKIE_DOMAIN }

const verifyRefreshToken = async (req, res, next) => {
    let token = await req.cookies.refreshToken;
    try {
        req.verify = jwt.verify(token, jwtRefreshSecret);
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(403).json({ success: false, error: "Token Error" });
    }
    next()
};

const verifyAccessToken = async (req, res, next) => {
    try {
      let token = await req.body.accessToken.split(" ")[1]
      if (!token) {
        return res.status(401).json({ success: false, error: "Not Authorized" });
      }
      req.verify = jwt.verify(token, jwtAccessSecret);
    } catch (error) {
      return res.status(401).json({ success: false, error: "Not Authorized" });
    }
    next()
  };

module.exports = { verifyRefreshToken, verifyAccessToken }