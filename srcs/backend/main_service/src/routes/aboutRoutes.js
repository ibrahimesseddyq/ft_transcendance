import express from 'express';
import { getAboutUs } from '../controllers/aboutController.js';

const router = express.Router();

router.get('/', getAboutUs);

export default router;
