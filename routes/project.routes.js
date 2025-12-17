import express from 'express';
import {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/project.controller.js';
// import { verifyToken } from '../middleware/verifyToken.js'; //ditambahkan nanti

const router = express.Router();


router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);


export default router;