import express from 'express';

import { getStats } from '../controllers/dashboard.controller.js';

// import { verifyToken } from '../middleware/verifyToken.js'; // Pastikan path ini benar
// import { isAdmin } from '../middleware/adminAuth.js';   // Pastikan path ini benar

const router = express.Router();

// router.get('/stats', [verifyToken, isAdmin], getStats);

export default router;