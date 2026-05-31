import express from 'express';
import {
  getIntersections,
  getIntersectionById,
  updateSignalState,
  triggerEmergencyOverride,
  resetToAuto,
} from '../controllers/intersection.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getIntersections);
router.get('/:id', getIntersectionById);
router.put('/:id/signal', updateSignalState);
router.post('/:id/override', triggerEmergencyOverride);
router.post('/:id/reset', resetToAuto);

export default router;
