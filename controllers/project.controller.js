import Project from '../models/ProjectModel.js';
import Component from '../models/ComponentModel.js';
import ProjectComponent from '../models/ProjectComponentModel.js';

export const createProject = async(req, res) => {
    const { projectName, project_name } = req.body;
    const userId = req.userId;

    try {
        await Project.create({
            project_name: projectName || project_name,
            user_id: userId
        });

        res.status(201).json({
            msg:"Project berhasil dibuat!",
            projectId: newProject.id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Gagal membuat project!"});
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.userId; 

        const projects = await Project.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId
            },
            include: [{
                model: Component,
                through: { attributes: ['order'] }
            }],
            order: [[Component, ProjectComponent, 'order', 'ASC']]
        });

        if (!project) return res.status(404).json({ msg: "Proyek tidak ditemukan atau akses ditolak" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;
        const { project_name, components } = req.body;

        // Cek Project
        const project = await Project.findOne({
            where: { id: projectId, user_id: userId }
        });

        if (!project) return res.status(404).json({ msg: "Proyek tidak ditemukan" });

        // Update Nama Project (jika ada)
        if (project_name) {
            await project.update({ project_name });
        }

        // Update Komponen
        if (components && Array.isArray(components)) {
            // Hapus semua komponen lama di proyek ini
            await ProjectComponent.destroy({
                where: { project_id: projectId }
            });

            const componentsData = components.map((comp, index) => ({
                project_id: projectId,
                component_id: comp.id,
                order: index + 1
            }));

            // Simpan
            if (componentsData.length > 0) {
                await ProjectComponent.bulkCreate(componentsData);
            }
        }

        res.status(200).json({ msg: "Proyek berhasil disimpan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal menyimpan proyek" });
    }
};

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