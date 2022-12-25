const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Grid = require('gridfs-stream');
const { verifyAccessToken } = require("../middleware/jwtVerify");
const User = require("../models/User");
const Ringtone = require("../models/Ringtone");
const upload = require("../lib/storageEngine");
const { cloudinary } = require("../lib/cloudinary");

const conn = mongoose.connection
let gfs
let gridfsBucket

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('ringtones')
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'ringtones'
    });
})

// route for uploading a file  /ring/upload
router.post('/upload', verifyAccessToken, upload.single('file'), async (req, res) => {
    try {
        const uploadedFile = req.file
        const { title, origin, image } = req.body
        const user = await User.findById({ _id: req.verify.id });
        if (!user) {
            return res.status(403).json({ success: false, error: 'No User Found' });
        }

        const response = await cloudinary.uploader.upload(image, {
            upload_preset: "thumbnail"
        });

        const newRing = new Ringtone({
            ringID: uploadedFile.id,
            uid: user.id,
            title,
            origin,
            thumbnail: response.secure_url,
        })
        await newRing.save()
        return res.status(200).json({ success: true, message: "Ringtone Uploaded Successfully!", ringID: newRing.id })
    } catch (error) {
        return res.status(500).json({ error })
    }
})

//Update Video Meta
router.post('/updatevideometa', async (req, res) => {
    try {
        const { id, title, description, thumbnail } = req.body

        let updRing = {}
        if (title) {
            updRing.title = title
        }
        if (description) {
            updRing.description = description
        }
        if (thumbnail) {
            const response = await cloudinary.uploader.upload(thumbnail);
            updRing.thumbnail = response.secure_url
        }

        await Ringtone.findOneAndUpdate({ _id: id }, updRing)
        return res.status(200).json({ success: true, message: "Successfully Updated!" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Internal Server Error" })
    }

})

// route for streaming a file  /ring/stream?fileid=
router.get('/stream', async (req, res) => {
    try {
        const { fileid } = req.query

        const range = req.headers.range
        if (!range) {
            return res.status(400).send('Requires range header')
        }
        const ObjectID = mongoose.mongo.ObjectId;
        const ring = await gfs.files.findOne({ "_id": ObjectID(fileid) })

        if (!ring) {
            return res.status(400).send('No Video Found')
        }

        const ringSize = ring.length
        const start = Number(range.replace(/\D/g, ""))
        const end = ringSize - 1
        const contentLength = end - start + 1
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${ringSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers)
        const readstream = await gridfsBucket.openDownloadStreamByName(ring.filename, {
            start, end
        })
        readstream.pipe(res)
    } catch (error) {
        return res.status(400).send('Internal server error')
    }
})

// route for fetching all the files from the media bucket  /ring/files
router.get('/files', async (req, res) => {
    try {
        const ring = await Ringtone.find({}).populate({ path: 'uid', model: User, select: 'username pfp' }).select('ringID title thumbnail likes origin downloads createdAt')
        return res.status(200).json(ring);
    } catch (err) {
        return res.status(400).send(err)
    }
})

// route for deleting a file
router.delete('/delete/:filename', async (req, res) => {
    const { filename } = req.params
    try {

        await gfs.files.remove({ filename })

        res.status(200).end()
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/getone/:ringID', async (req, res) => {
    const { ringID } = req.params
    try {
        const ring = await Ringtone.findById({ _id: ringID }).populate({ path: 'uid', model: User, select: 'username pfp' }).select('ringID title thumbnail likes origin downloads createdAt')
        return res.status(200).json(ring);
    } catch (err) {
        return res.status(400).send(err)
    }
})

module.exports = router