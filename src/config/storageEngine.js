import crypto from 'crypto'
import path from 'path'
import GridFsStorage from 'multer-gridfs-storage'
import multer from 'multer'

// secifying a storage location in our cluster for multer
const storage = new GridFsStorage.GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: 'ringtones'
                };
                return resolve(fileInfo);
            });
        });
    }
});

// inializing our multer storage
export const upload = multer({ storage });