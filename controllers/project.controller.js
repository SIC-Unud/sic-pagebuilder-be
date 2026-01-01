import Project from '../models/ProjectModel.js';
import Component from '../models/ComponentModel.js';
import ProjectComponent from '../models/ProjectComponentModel.js';

/**
 * Membuat proyek baru untuk user yang sedang login.
 * @route POST /api/projects
 * @access Private (User)
 * @param {string} req.body.project_name - Nama proyek baru
 * @returns {object} projectId - ID proyek untuk redirect frontend
 */
export const createProject = async(req, res) => {
    const { projectName, project_name } = req.body;
    const userId = req.userId; // Didapat dari middleware verifyToken

    try {
        const newProject = await Project.create({
            project_name: projectName || project_name,
            user_id: userId
        });

        res.status(201).json({
            msg:"Project berhasil dibuat!",
            projectId: newProject.id // Mengembalikan ID agar bisa langsung diedit
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Gagal membuat project!"});
    }
};

/**
 * Mengambil semua daftar proyek milik user.
 * @route GET /api/projects
 * @access Private (User)
 */
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

/**
 * Mengambil detail satu proyek beserta komponen di dalamnya.
 * @route GET /api/projects/:id
 * @access Private (Owner Only)
 * @description Mengambil data proyek + komponen yang di-join melalui tabel 'project_components'
 */
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId // Security: Pastikan hanya pemilik yang bisa akses
            },
            include: [{
                model: Component,
                through: { attributes: ['order'] } // Ambil info urutan (order)
            }],
            // Urutkan komponen berdasarkan kolom 'order' agar tampilan tidak acak
            order: [[Component, ProjectComponent, 'order', 'ASC']]
        });

        if (!project) return res.status(404).json({ msg: "Proyek tidak ditemukan atau akses ditolak" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

/**
 * Menyimpan perubahan proyek (Nama & Susunan Komponen Drag-Drop).
 * @route PATCH /api/projects/:id
 * @access Private (Owner Only)
 * @param {array} req.body.components - Array object komponen [{id: 1}, {id: 2}]
 */
export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;
        const { project_name, components } = req.body;

        // Validasi Kepemilikan Proyek
        const project = await Project.findOne({
            where: { id: projectId, user_id: userId }
        });

        if (!project) return res.status(404).json({ msg: "Proyek tidak ditemukan" });

        // Update Nama Project (jika dikirim)
        if (project_name) {
            await project.update({ project_name });
        }

        // Update Komponen (Logika Reset & Insert Ulang)
        // Strategi: Hapus semua relasi lama -> Buat relasi baru dengan urutan baru
        if (components && Array.isArray(components)) {
            await ProjectComponent.destroy({
                where: { project_id: projectId }
            });

            // Map komponen untuk menyertakan urutan (index + 1)
            const componentsData = components.map((comp, index) => ({
                project_id: projectId,
                component_id: comp.id,
                order: index + 1
            }));

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

/**
 * Menghapus proyek secara permanen.
 * @route DELETE /api/projects/:id
 * @access Private (Owner Only)
 */
export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.userId;

        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ msg: "Proyek tidak ditemukan" });
        }

        // Security check manual (optional, karena di findByPk belum filter user)
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