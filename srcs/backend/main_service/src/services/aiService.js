import fs from 'fs';
import FormData from 'form-data';
import aiClient from '../utils/aiClient.js';

export const classifyAvatar =  async (filePath) => {
    const form =  new FormData();
    form.append('file', fs.createReadStream(filePath));
    const res = await aiClient.post('/api/ai/classify', form , {headers : form.getHeaders()});
    return res.data;
}

export const moderateText = async (text, meta = {}) => {
    const res = await aiClient.post('/api/ai/moderate', {text, meta});
    return res.data;
}