import jwt from 'jsonwebtoken';

/**
 * Middleware untuk memverifikasi JSON Web Token (JWT) dari client.
 * Berfungsi untuk melindungi rute privat agar hanya bisa diakses user login.
 * * @param {object} req - Request object dari Express
 * @param {object} res - Response object
 * @param {function} next - Fungsi untuk lanjut ke controller berikutnya
 */
export const verifyToken = (req, res, next) => {
    // Ambil token dari header Authorization (Format: "Bearer [TOKEN]")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // Jika tidak ada token, tolak akses (401 Unauthorized)
    if (token == null) return res.status(401).json({ msg: "Akses ditolak. Token tidak disediakan." });

    // Verifikasi validitas token menggunakan secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // Jika token salah/expired, tolak akses (403 Forbidden)
        if (err) return res.status(403).json({ msg: "Token tidak valid." });
        
        // Simpan data user (payload) ke dalam request agar bisa dipakai di controller
        req.userId = decoded.userId;
        req.role = decoded.role;

        // Lanjut ke proses berikutnya
        next();
    });
};