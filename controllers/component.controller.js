import ProjectComponent from "../models/ProjectComponentModel.js";
import Component from "../models/ComponentModel.js";

export const getAllComponents = async (req, res) => {
    try {
        const components = await Component.findAll();
        res.json(components);
    } catch (e) {
        res.json({ msg: "Gagal memuat komponen!" });
    }
};

export const getComponentById = async (req, res) => {
    try {
        const components = await Component.findOne({
            where: { id: req.params.id }
        });
        if(!components) {
            return res.status(404).json({ msg: "Komponen tidak ditemukan!" });
        }
        res.json(components);
    } catch (e) {
        res.json({ msg: "Gagal memuat komponen!" });
    }
};

export const createComponent = (req, res) => {};

export const updateComponent = (req, res) => {};

export const deleteComponent = (req, res) => {};