<<<<<<< HEAD
import Project from '../models/ProjectModel.js';

export const createProject = async (req, res) => {};

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.userId; // Didapat dari middleware verifyToken

        const projects = await Project.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
=======
import Project from "../models/ProjectModel.js";

export const createProject = async(req, res) => {
    const {projectName} = req.body;
        const userId = req.userID;
        if(!userID){
            return res.status(400).json({msg: "User ID tidak ditemukan!"});
        }
    try {
        await Project.create({
            name: projectName,
            user_id: userId
        });

        res.status(201).json({msg:"Project berhasil dibuat!"});

    } catch (error) {
        res.status(500).json({msg: "Gagal membuat project!"});
    }
};

export const getUserProjects = async (req, res) => {};
>>>>>>> origin/dev/galang/User

export const getProjectById = (req, res) => {};

export const updateProject = (req, res) => {};

export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ msg: "Proyek tidak ditemukan" });
        }

        if (project.user_id !== userId) {
            return res.status(403).json({ msg: "Akses ditolak. Anda bukan pemilik proyek ini." });
        }

        await project.destroy();

        res.status(200).json({ msg: "Proyek berhasil dihapus" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};