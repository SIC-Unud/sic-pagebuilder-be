import express from 'express';
import { getStats } from '../controllers/dashboard.controller.js';

import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/stats', verifyToken, isAdmin, getStats);

export default router;