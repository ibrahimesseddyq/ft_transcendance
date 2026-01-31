const multer =  require('multer');
const path =  require('path');
const {HttpException} = require('../utils/httpExceptions');

const diskStorage =  multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.fieldname === 'avatar' ?
        'uploads/avatars':
        'uploads/resumes';
        cb(null, uploadPath);
    },
    filename:(req, file, cb) => {
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
        fileSize : 10 * 1024 * 1024,
        files: 1
    }
});


module.exports = upload;
