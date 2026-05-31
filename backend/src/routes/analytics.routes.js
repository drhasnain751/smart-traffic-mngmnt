import express from 'express';
import { getTrends, getForecast, getRecommendations } from '../controllers/analytics.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/trends', getTrends);
router.get('/forecast', getForecast);
router.get('/recommendations', getRecommendations);

export default router;
