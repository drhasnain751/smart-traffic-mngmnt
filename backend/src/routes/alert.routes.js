import express from 'express';
import { getAlerts, resolveAlert, createAlert } from '../controllers/alert.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getAlerts);
router.put('/:id/resolve', resolveAlert);
router.post('/', createAlert);

export default router;
