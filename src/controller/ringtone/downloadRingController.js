import Grid from "gridfs-stream";
import mongoose from "mongoose";

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
    console.log(filename);
    try {

        const ObjectID = mongoose.mongo.ObjectId;
        const ring = await gfs.files.findOne({ "_id": ObjectID(filename) })
        if (!ring) {
            return res.status(400).send('No Ring Found!')
        }

        const contentType = ring.contentType
        //setting response header
        const headers = {
            "Accept-Ranges": "bytes",
            "Content-Disposition": `attachment; filename=${filename}`,
            "Content-Type": `${contentType}`
        };
        res.writeHead(206, headers)

        //Streaming the audio for downloading
        const downstream = await gridfsBucket.openDownloadStreamByName(ring.filename);
        downstream.pipe(res)
    } catch (err) {
        return res.status(400).send("Internal Server Error")
    }
}