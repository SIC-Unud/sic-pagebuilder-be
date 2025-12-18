import Project from '../models/ProjectModel.js';

// --- CREATE PROJECT (Dari Galang, tapi diperbaiki) ---
export const createProject = async(req, res) => {
    // Frontend mungkin mengirim 'projectName' atau 'project_name'
    const { projectName, project_name } = req.body;
    const userId = req.userId; // Ambil dari middleware (konsisten dengan verifyToken)

    try {
        await Project.create({
            // Pastikan masuk ke kolom 'project_name' sesuai Model
            project_name: projectName || project_name, 
            user_id: userId
        });

        res.status(201).json({msg:"Project berhasil dibuat!"});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Gagal membuat project!"});
    }
};

// --- READ PROJECTS (Dari Anda/HEAD) ---
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

// Placeholder untuk fitur detail & update (bisa diisi nanti dengan logika komponen)
export const getProjectById = (req, res) => {};
export const updateProject = (req, res) => {};

// --- DELETE PROJECT (Dari Anda/HEAD) ---
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