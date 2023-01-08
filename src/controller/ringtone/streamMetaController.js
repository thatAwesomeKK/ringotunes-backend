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
            "Content-Type": "audio/mpeg",
        };

        res.writeHead(206, headers)
        const readstream = await gridfsBucket.openDownloadStreamByName(ring.filename, {
            start, end
        })
        readstream.pipe(res)
    } catch (error) {
        return res.status(400).send('Internal server error')
    }
}