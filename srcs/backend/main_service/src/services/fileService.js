const {HttpException} = require('../utils/httpExceptions');
const path =  require('path');
const fs = require('fs').promises;

const saveResume = async (userId, file) => {
    try {
        const fileExt = path.extname(file.originalname);
        const filename = `${userId}${fileExt}`;
        const resumePath = '/uploads/resumes/' + filename;
        return {
            resumeUrl: resumePath,
            fileSize: file.size,
            originalName: file.originalname
        }
    } catch (error) {
        throw new HttpException(500, "failed to save file");
    }
}

const saveAvatar = async (userId, file) => {
    try {
        const fileExt = path.extname(file.originalname);
        const filename = `${userId}${fileExt}`;
        const avatarPath = '/uploads/avatars/' + filename;
        return {
            avatarUrl: avatarPath,
            fileSize: file.size,
            originalName: file.originalname
        }
    } catch (error) {
        throw new HttpException(500, "failed to save file");
    }
}

const deleteFile = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.unlink(fullPath);
    } catch (error) {
       
    }
   
}

const fileExists = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.access(fullPath);
        return true;
    } catch (error) {
        return false;
    }
    
}

module.exports = {
    saveResume,
    saveAvatar,
    deleteFile,
    fileExists
}