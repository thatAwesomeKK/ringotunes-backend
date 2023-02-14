import { Router } from "express";
import checkLikeController from "../controller/user/checkLikeController.js";
import getDashController from "../controller/user/getDashController.js";
import getDownloadedRingsController from "../controller/user/getDownloadedRingsController.js";
import getLikedRingsController from "../controller/user/getLikedRingsController.js";
import getProfileController from "../controller/user/getProfileController.js";
import getUserInfoController from "../controller/user/getUserInfoController.js";
import handleDownloadController from "../controller/user/handleDownloadController.js";
import handleLikeController from "../controller/user/handleLikeController.js";
import checkEmailVerified from "../middleware/checkEmailVerified.js";
const router = Router();
import { verifyAccessToken } from "../middleware/jwtVerify.js";

//POST
router.patch('/handle-download', verifyAccessToken, checkEmailVerified, handleDownloadController) //Add Download /user/handle-download
router.patch('/handle-like', verifyAccessToken, handleLikeController) //Update Like /user/handle-like
router.post('/check-like', verifyAccessToken, checkLikeController) //Check Liked /user/check-like

//GET
router.get('/dash', verifyAccessToken, checkEmailVerified, getDashController) //Get all the Dashboard Detail /user/dash
router.get('/profile/:uid', getProfileController) //Get Profile of User /user/:uid
router.get('/myliked', verifyAccessToken, getLikedRingsController) //Get Liked Rings /user/myliked
router.get('/mydownloads', verifyAccessToken, getDownloadedRingsController) //Get all the Downloaded Rings /user/mydownloads
router.get('/info', verifyAccessToken, getUserInfoController) //Get all the Downloaded Rings /user/mydownloads

export default router 
