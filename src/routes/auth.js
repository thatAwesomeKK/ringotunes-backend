import { Router } from "express";
const router = Router();
import createUserController from "../controller/auth/createUserController.js";
import forgotPasswordChangeController from "../controller/auth/forgotPasswordChangeController.js";
import forgotPasswordIniController from "../controller/auth/forgotPasswordIniController.js";
import forgotPasswordVerifyController from "../controller/auth/forgotPasswordVerifyController.js";
import googleLoginController from "../controller/auth/googleLoginController.js";
import loginUserController from "../controller/auth/loginUserController.js";
import logoutController from "../controller/auth/logoutController.js";
import updateUserController from "../controller/auth/updateUserController.js";
import verifyEmailController from "../controller/auth/verifyEmailController.js";
import verifyRefreshController from "../controller/auth/verifyRefreshController.js";
import {
  verifyAccessToken,
  verifyEmailToken,
  verifyForgotPasswordToken,
  verifyRefreshToken,
  verifyTempToken,
} from "../middleware/jwtVerify.js";
import passportMiddleware from "../middleware/passportMiddleware.js";

//POST
router.post("/register", createUserController); //Register User /auth/register
router.post("/login", loginUserController); //Login user /auth/login
router.post("/google-login", googleLoginController); //Google-Login /auth/google-login
router.post("/forgot-password-ini", forgotPasswordIniController); //Initiate Forgot Password Sequence /auth/forgot-password-ini
router.post(
  "/forgot-password-change",
  verifyTempToken,
  forgotPasswordChangeController
); //Change the Password with a Token / auth/forgot-password-change

//PUT
router.put("/update", passportMiddleware, updateUserController); //Update the User Profile /auth/update

//GET
router.get("/verify-email", verifyEmailToken, verifyEmailController); //Verify Email /auth/verify-email
router.get("/refresh", verifyRefreshToken, verifyRefreshController); //Refresh the RefreshToken /auth/refresh
router.get(
  "/forgot-password-verify",
  verifyForgotPasswordToken,
  forgotPasswordVerifyController
); //Verify Forogt Password Token from Email /auth/forgot-password-verify
router.get("/logout", passportMiddleware, logoutController); //Logout the User /auth/logout

export default router;
