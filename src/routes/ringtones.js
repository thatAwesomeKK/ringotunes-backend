import { Router } from "express";
const router = Router();
import { verifyAccessToken } from "../middleware/jwtVerify.js";
import checkEmailVerified from "../middleware/checkEmailVerified.js";
import { upload } from "../config/storageEngine.js";
import uploadRingController from "../controller/ringtone/uploadRingController.js";
import updateRingMetaController from "../controller/ringtone/updateRingMetaController.js";
import streamMetaController from "../controller/ringtone/streamMetaController.js";
import getAllRingsController from "../controller/ringtone/getAllRingsController.js";
import downloadRingController from "../controller/ringtone/downloadRingController.js";
import deleteRingController from "../controller/ringtone/deleteRingController.js";
import getOneRingController from "../controller/ringtone/getOneRingController.js";
import getOneRandomController from "../controller/ringtone/getOneRandomController.js";
import passportMiddleware from "../middleware/passportMiddleware.js";

//POST
router.post('/upload', passportMiddleware, checkEmailVerified, upload.single('file'), uploadRingController) //Upload Ringtone, if email verified /ring/upload

//PUT
router.put('/updateringmeta', updateRingMetaController) //Update the Video MetaData /ring/updatevideometa

//GET
router.get('/stream', streamMetaController) //Stream the Ringtone /ring/stream?=fileid
router.get('/files', getAllRingsController) //Fetch all the rings /ring/files?=page&?=limit
router.get('/download/:filename', downloadRingController) //Download a ring /ring/files/:filename
router.get('/getone/:ringID', getOneRingController) //Get One Ring /ring/getone/:ringID
router.get('/getonerandom', getOneRandomController) //Get One Random Ring /ring/getonerandom

//DELETE
router.delete('/delete/:filename', passportMiddleware, checkEmailVerified, deleteRingController) //Delete a ring /ring/delete/:filename

export default router