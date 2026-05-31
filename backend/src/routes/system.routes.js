import express from 'express';
import { getSettings, updateSettings } from '../controllers/system.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
