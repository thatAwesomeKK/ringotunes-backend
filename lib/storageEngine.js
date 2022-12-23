const crypto = require('crypto');
const path = require('path');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer')
const mongoURI = process.env.DATABASE_URL

// secifying a storage location in our cluster for multer
const storage = new GridFsStorage({
    url: mongoURI,
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
const upload = multer({ storage });

module.exports = upload