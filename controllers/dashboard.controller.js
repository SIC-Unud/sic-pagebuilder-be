import User from '../models/UserModel.js';
import Component from '../models/ComponentModel.js';

/**
 * Mengambil ringkasan statistik data untuk Dashboard Admin.
 * @route GET /api/dashboard/stats
 * @access Admin Only
 * @returns {object} JSON berisi total user dan total komponen.
 */
export const getStats = async (req, res) => {
    try {
        // Menghitung total baris di tabel Users dan Components
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