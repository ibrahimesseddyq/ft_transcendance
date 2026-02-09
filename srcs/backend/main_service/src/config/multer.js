const multer =  require('multer');
const path =  require('path');
const fs = require('fs/promises');
const {HttpException} = require('../utils/httpExceptions');
// the follwing needs to be confirmed that they are working properly
await fs.mkdir(`${__dirname}uploads/avatars`, {recursive: true});
await fs.mkdir(`${__dirname}uploads/resumes`, {recursive: true});

const diskStorage =  multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'avatar' ?
        'uploads/avatars':
        'uploads/resumes';
        cb(null, uploadPath);
    },
    filename:(req, file, cb) => {
        console.log(req.body)
        const filename = req.params?.id || req.body.userId;
        const ext = path.extname(file.originalname);
        cb(null,`${filename}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "avatar"){
        const allowedMimes = ["image/jpeg", "image/png" , "image/jpg", "image/webp"];
        if (allowedMimes.includes(file.mimetype))
            cb (null, true)
        else
            cb(new HttpException(400, "allowed formats are : .jpeg .png .jpg .webp"), false)
    }
    else if( file.fieldname === "resume"){
         if (file.mimetype === "application/pdf")
            cb (null, true);
        else
            cb (new HttpException(400, "file format should be pdf"));
    }
}

const upload =  multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits  :{
        fileSize : 5 * 1024 * 1024,
        files: 1
    }
});

const uploadProfile = multer({
    
    storage: diskStorage,
    fileFilter: fileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024,
        files: 2
    } 
})

module.exports = {
    upload,
    uploadProfile
};
