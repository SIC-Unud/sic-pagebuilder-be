import User from "../models/UserModel.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ msg: "Akses ditolak. Memerlukan peran admin." });
        }
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server." });
    }
};