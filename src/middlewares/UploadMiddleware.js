const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const config = require('../configs/env');

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_KEY,
    api_secret: config.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: (req, file) => {
            return `fiverr/${req.user.slug}`;
        },
        public_id: (req, file) => {
            const prefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            return `${file.fieldname}-${prefix}-${file.originalname.split('.').shift()}`;
        },
        allowedFormats: ['jpg', 'png', 'jpeg'],
        transformation: { width: 400, height: 400, crop: 'limit' },
        format: 'jpg',
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
