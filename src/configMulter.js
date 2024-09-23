const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
// exports.upload_image = function (req, res, next) {

//     var upload = multer({
//         storage: multer.diskStorage({
//             destination: function (req, file, cb) {
//                 cb(null, 'public/cms/images/uploads')
//             },
//             filename: function (req, file, cb) {
//                 cb(null, randomString.generate({ length: 7, charset: 'alphanumeric' }) + path.extname(file.originalname))
                
//             }

//         })
//     })

//     upload.single('imagefile');

//     return next();

// }