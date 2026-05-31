import express from 'express';
import { login, signup, getMe } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', authenticateJWT, getMe);

export default router;
