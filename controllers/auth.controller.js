import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

/**
 * Mendaftarkan user baru ke dalam sistem.
 * @route POST /api/auth/register
 * @access Public
 * @param {string} req.body.name - Nama lengkap user
 * @param {string} req.body.username - Username unik
 * @param {string} req.body.email - Email valid
 * @param {string} req.body.password - Password akun
 * @param {string} req.body.confPassword - Konfirmasi password
 */
export const register = async (req, res) => {
    const { name, username, email, password, confPassword } = req.body;

    // Validasi kesesuaian password
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" })
    };

    try {
        // Cek duplikasi email dan username di database
        const existingUser = await User.findOne({ where: { email: email } });
        const existingUsername = await User.findOne({ where: { username: username } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah digunakan" })
        }

        if (existingUsername) {
            return res.status(400).json({ msg: "Username sudah digunakan" })
        }

        // Enkripsi password sebelum disimpan (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword
        });

        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

/**
 * Otentikasi user dan memberikan Access Token.
 * @route POST /api/auth/login
 * @access Public
 * @param {string} req.body.username - Username user
 * @param {string} req.body.password - Password user
 * @returns {object} accessToken - JSON Web Token untuk otorisasi
 */
export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Username tidak ditemukan" });
        }

        // Verifikasi password dengan database (compare hash)
        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            return res.status(400).json({ msg: "Password salah" });
        }

        // Siapkan payload untuk token
        const userId = user.id;
        const name = user.name;
        const username = user.username;
        const email = user.email;
        const role = user.role;

        // Generate JWT Token (Berlaku 1 jam)
        const accessToken = jwt.sign({ userId, name, username, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ accessToken });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

/**
 * Mengirim email reset password ke user yang lupa kata sandi.
 * @route POST /api/auth/forgot-password
 * @access Public
 * @param {string} req.body.email - Email terdaftar
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) return res.status(404).json({ msg: "Email tidak terdaftar" });

        // Buat token unik random & set expired 1 jam
        const token = crypto.randomBytes(20).toString('hex');
        const expireTime = Date.now() + 3600000;

        // Simpan token ke database user
        await User.update({
            resetPasswordToken: token,
            resetPasswordExpires: expireTime
        }, {
            where: { email: email }
        });

        // Konfigurasi Nodemailer (Menggunakan Mailtrap/Gmail dari .env)
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Link yang akan diklik user di email (Arahkan ke Frontend)
        const resetLink = `http://127.0.0.1:5500/frontend/index.html?token=${token}`;

        const mailOptions = {
            from: 'no-reply@pagebuilder.com',
            to: email,
            subject: 'Link Reset Password',
            text: `Klik link ini untuk reset password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Email reset password telah dikirim." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

/**
 * Mengatur ulang password menggunakan token valid.
 * @route POST /api/auth/reset-password/:token
 * @access Public
 * @param {string} req.params.token - Token reset dari URL email
 * @param {string} req.body.newPassword - Password baru
 * @param {string} req.body.confNewPassword - Konfirmasi password baru
 */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confNewPassword } = req.body;

        // Cari user dengan token yang cocok DAN belum expired
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) return res.status(400).json({ msg: "Token tidak valid atau expired" });

        if (newPassword !== confNewPassword) {
            return res.status(400).json({ msg: "Password tidak cocok" });
        }

        // Hash password baru & bersihkan token lama
        const salt = await bcrypt.genSalt(10);
        const hashNewPassword = await bcrypt.hash(newPassword, salt);

        await User.update({
            password: hashNewPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, {
            where: { id: user.id }
        });

        res.status(200).json({ msg: "Password berhasil direset! Silakan login." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};