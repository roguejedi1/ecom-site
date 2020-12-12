const crypto = require('crypto');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dfqawzsiv',
    api_key: '577216351398222',
    api_secret: process.env.CLOUDINARY_SECRET
});
const cloudinaryStorage = require('multer-storage-cloudinary');
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'ecommerce',
    allowedFormats: ['jpeg', 'jpg', 'png'],
    filename: function(req, file, cb) {
        let buf = crypto.randomBytes(16);
        buf = buf.toString('hex');
        let uniqueFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
        uniqueFileName += buf;
        cb(undefined, uniqueFileName);
    }
});

module.exports = {
    cloudinary,
    storage
}