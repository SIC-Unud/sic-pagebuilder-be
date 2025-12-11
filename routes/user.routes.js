import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllUsers);
router.post('/', verifyToken, isAdmin, createUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

router.get('/:id', verifyToken, isAdmin, getUserById);
router.patch('/:id', verifyToken, isAdmin, updateUser);

export default router;