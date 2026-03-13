import fs from 'fs';
import formData from 'form-data';
import aiClient from '../utils/aiClient.js';

export const classifyAvatar =  async (filePath) => {
    const form =  new formData();
    form.append('file', fs.createReadStream(filePath));
    const res = await aiClient.post('/api/ai/classify', form , {Headers : form.getHeaders()});
    return res.data;
}

export const moderateText = async (text, meta = {}) => {
    const res = await aiClient.post('/api/ai/moderate-text', {text, meta});
    return res.data;
}