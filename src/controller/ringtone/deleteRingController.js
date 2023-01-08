import Grid from "gridfs-stream";
import mongoose from "mongoose";
import Ringtone from "../../models/Ringtone.js";

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

export default async function (req, res) {
    const { filename } = req.params
    
    try {
        const foundRing = await Ringtone.findById(filename)
        if (!foundRing) {
            return res.status(400).send('No Ring Found in DB')
        }

        const ObjectID = mongoose.mongo.ObjectId;
        const ring = await gfs.files.findOne({ "_id": ObjectID(foundRing.ringID)})
        if (!ring) {
            return res.status(400).send('No Ring Found in Chunks')
        }

        await gridfsBucket.delete(ObjectID(ring._id))
        await Ringtone.findByIdAndDelete(foundRing._id)

        res.status(200).json({ success: true, message: 'Ringtone deleted successfully' })
    } catch (err) {
        res.status(400).send(err)
    }
}