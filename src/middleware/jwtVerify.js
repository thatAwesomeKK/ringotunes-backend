import jwt from "jsonwebtoken"
import cookieConfig from "../config/cookieConfig.js";

const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtEmailSecret = process.env.JWT_EMAIL_SECRET;
const jwtTempSecret = process.env.JWT_TEMP_SECRET;
const jwtForgotPasswordSecret = process.env.JWT_FORGOT_PASSWORD_SECRET;


//Verify Refresh Token
export const verifyRefreshToken = async (req, res, next) => {
  try {
    let token = await req.headers.refreshtoken;
    if (!token) {
      return res.status(401).json({ success: false, error: "Not Authorized" });
    }
    req.verify = jwt.verify(token, jwtRefreshSecret);

  } catch (error) {
    res.clearCookie('refreshToken', cookieConfig);
    return res.status(403).json({ success: false, error: "Not Authorized" });
  }
  next()
};

//Verify Access Token
export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = await req.headers.accesstoken.split(" ")[1]
    if (!token) {
      return res.status(401).json({ success: false, error: "Not Authorized" });
    }
    req.verify = jwt.verify(token, jwtAccessSecret);
  } catch (error) {
    return res.status(401).json({ success: false, error: "Not Authorized" });
  }
  next()
};

//Verify Email Token
export const verifyEmailToken = async (req, res, next) => {
  try {
    let { token } = req.query
    if (!token) {
      return res.status(401).json({ success: false, error: "Token is Invalid" });
    }
    req.verify = jwt.verify(token, jwtEmailSecret);
  } catch (error) {
    return res.status(401).json({ success: false, error: "Token is Invalid" });
  }
  next()
};

//Verify Forgot Password Token
export const verifyForgotPasswordToken = async (req, res, next) => {
  try {
    let { token } = req.query
    if (!token) {
      return res.status(401).json({ success: false, error: "Token is Invalid" });
    }
    req.verify = jwt.verify(token, jwtForgotPasswordSecret);
  } catch (error) {
    return res.status(401).json({ success: false, error: "Token is Invalid" });
  }
  next()
};

//Verify Temp Token
export const verifyTempToken = async (req, res, next) => {
  try {
    let { token } = req.query
    if (!token) {
      return res.status(401).json({ success: false, error: "Token is Invalid" });
    }
    req.verify = jwt.verify(token, jwtTempSecret);
  } catch (error) {
    return res.status(401).json({ success: false, error: "Token is Invalid" });
  }
  next()
};