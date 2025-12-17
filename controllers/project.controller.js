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

export const getProjectById = (req, res) => {};

export const updateProject = (req, res) => {};

export const deleteProject = (req, res) => {};