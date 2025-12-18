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

<<<<<<< HEAD
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getUserProjects);
router.get('/:id', verifyToken, getProjectById);
router.patch('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);
=======

router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);
>>>>>>> origin/dev/galang/User


export default router;