import User from "../models/UserModel.js";

/**
 * Middleware khusus untuk membatasi akses hanya untuk Admin.
 */
export const isAdmin = async (req, res, next) => {
    try {
        // Cari user berdasarkan ID yang didapat dari verifyToken
        const user = await User.findByPk(req.userId);

        // Cek apakah role user adalah 'admin'
        if (user && user.role === 'admin') {
            next(); // Boleh lewat / lanjut
        } else {
            res.status(403).json({ msg: "Akses ditolak. Memerlukan peran admin." });
        }
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
};