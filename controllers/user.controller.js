import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'username', 'email', 'role']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'name', 'username', 'email', 'role']
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, username, email, password, role } = req.body;
    if (!password) return res.status(400).json({ msg: "Password harus diisi" });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword,
            role: role || 'user'
        });
        res.status(201).json({ msg: "User berhasil dibuat" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: { id: req.params.id }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const { name, username, email, password, role } = req.body;
    let hashPassword;

    if (password === "" || password === null || password === undefined) {
        hashPassword = user.password;
    } else {
        const salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(password, salt);
    }

    const roleToSave = (req.role === 'admin') ? role : user.role;

    try {
        await User.update({
            name: name,
            username: username,
            email: email,
            password: hashPassword,
            role: roleToSave
        }, {
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: { id: req.params.id }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    try {
        await User.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "User Deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};