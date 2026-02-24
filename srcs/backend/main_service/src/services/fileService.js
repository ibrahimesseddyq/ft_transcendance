import {HttpException} from '../utils/httpExceptions.js';
import path from 'path';
import fs from 'fs/promises';

export const saveResume = async (userId, file) => {
    const fileExt = path.extname(file.originalname);
    const filename = `${userId}${fileExt}`;
    const resumePath = '/uploads/resumes/' + filename;
    return {
        type: 'resume',
        resumeUrl: resumePath
    }
}

export const saveAvatar = async (userId, file) => {
    const fileExt = path.extname(file.originalname);
    const filename = `${userId}${fileExt}`;
    const avatarPath = '/uploads/avatars/' + filename;
    return {
        type :'avatar',
        avatarUrl: avatarPath,
    }
}

export const deleteFile = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.unlink(fullPath);
    } catch (error) {
       
    }
   
}

export const fileExists = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.access(fullPath);
        return true;
    } catch (error) {
        return false;
    }
    
}
