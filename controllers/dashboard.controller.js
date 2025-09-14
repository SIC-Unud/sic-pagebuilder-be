import User from '../models/UserModel.js';
import Component from '../models/ComponentModel.js';

export const getStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const componentCount = await Component.count();
        res.json({
            totalUsers: userCount,
            totalComponents: componentCount
        });
    } catch (error) {
        res.status(500).json({ msg: "Gagal memuat statistik." });
    }
};