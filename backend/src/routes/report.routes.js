import express from 'express';
import { getReports, createReport, downloadReport } from '../controllers/report.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Allow download report by checking JWT or using token in query for easy links
router.get('/:id/download', authenticateJWT, downloadReport);

router.use(authenticateJWT);
router.get('/', getReports);
router.post('/', createReport);

export default router;
