import express from 'express';
import {
    getAllComponents,
    getComponentById,
    createComponent,
    updateComponent,
    deleteComponent
} from '../controllers/component.controller.js';

import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', getAllComponents);
router.get('/:id', getComponentById);

router.post('/', [verifyToken, isAdmin], createComponent);
router.patch('/:id', [verifyToken, isAdmin], updateComponent);
router.delete('/:id', [verifyToken, isAdmin], deleteComponent);

export default router;