const multer =  require('multer');
const path =  require('path');
const {HttpException} = require('../utils/httpExceptions');

const deskStorage =  multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = file.filename === 'avatar' ?
        'upload/avatar':
        'upload/resume';
        cb(null, uploadPath);
    },
    filename:(req, file, cb) =>
    {

    }                                                                         
})                 