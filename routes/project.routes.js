import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getUserProjects);
router.get('/:id', verifyToken, getProjectById);
router.patch('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;