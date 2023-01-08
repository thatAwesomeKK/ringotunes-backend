import jwt from 'jsonwebtoken'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtEmailSecret = process.env.JWT_EMAIL_SECRET;
const jwtForgotPasswordSecret = process.env.JWT_FORGOT_PASSWORD_SECRET;
const jwtTempSecret = process.env.JWT_TEMP_SECRET;

export const getAccessToken = (data) => {
    return jwt.sign(data, jwtAccessSecret, { expiresIn: '12h' });
}

export const getRefreshToken = (data) => {
    return jwt.sign(data, jwtRefreshSecret, { expiresIn: '1d' });
}

export const getEmailVerifyToken = (data) => {
    return jwt.sign(data, jwtEmailSecret, { expiresIn: '5m' });
}

export const getForgotPasswordToken = (data) => {
    return jwt.sign(data, jwtForgotPasswordSecret, { expiresIn: '5m' });
}

export const getTempToken = (data) => {
    return jwt.sign(data, jwtTempSecret, { expiresIn: '1m' });
}