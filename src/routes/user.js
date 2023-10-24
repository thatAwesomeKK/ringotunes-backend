import { Router } from "express";
const router = Router();
import checkLikeController from "../controller/user/checkLikeController.js";
import getDashController from "../controller/user/getDashController.js";
import getDownloadedRingsController from "../controller/user/getDownloadedRingsController.js";
import getLikedRingsController from "../controller/user/getLikedRingsController.js";
import getProfileController from "../controller/user/getProfileController.js";
import getUserInfoController from "../controller/user/getUserInfoController.js";
import handleDownloadController from "../controller/user/handleDownloadController.js";
import handleLikeController from "../controller/user/handleLikeController.js";
import checkEmailVerified from "../middleware/checkEmailVerified.js";
import passportMiddleware from "../middleware/passportMiddleware.js";

//POST
router.patch('/handle-download', passportMiddleware, checkEmailVerified, handleDownloadController) //Add Download /user/handle-download
router.patch('/handle-like', passportMiddleware, handleLikeController) //Update Like /user/handle-like
router.post('/check-like', passportMiddleware, checkLikeController) //Check Liked /user/check-like

//GET
router.get('/dash', passportMiddleware, checkEmailVerified, getDashController) //Get all the Dashboard Detail /user/dash
router.get('/profile/:uid', getProfileController) //Get Profile of User /user/:uid
router.get('/myliked', passportMiddleware, getLikedRingsController) //Get Liked Rings /user/myliked
router.get('/mydownloads', passportMiddleware, getDownloadedRingsController) //Get all the Downloaded Rings /user/mydownloads
router.get('/info', passportMiddleware, getUserInfoController)

export default router 
