const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    }
)
//set up an instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:
    {
        folder: 'YelpCamp',  //photos will be stored on this folder IN cloudinary
        allowedFormats: ['jpg', 'jpeg', 'png']
    },
})


module.exports = { cloudinary, storage }