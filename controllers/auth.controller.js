
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";


export const register = async (req, res) => {
    const { name, username, email, password, confPassword } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" })
    };

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        const existingUsername = await User.findOne({ where: { username: username } });

        if (existingUser) {
            return res.status(400).json({ msg: "Email sudah digunakan" })
        }

        if (existingUsername) {
            return res.status(400).json({ msg: "Username sudah digunakan" })
        }

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

export const login = async (req, res) => {
    try {
        const user = await User.findAll({
            where: { username: req.body.username }
        });

        if (user.length === 0) return res.status(404).json({ msg: "Username tidak ditemukan" });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Password Salah" });

        const userId = user[0].id;
        const name = user[0].name;
        const username = user[0].username;

        const accessToken = jwt.sign({ userId, name, username }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) return res.status(404).json({ msg: "Email tidak terdaftar" });

        const token = crypto.randomBytes(20).toString('hex');
        const expireTime = Date.now() + 3600000;

        await User.update({
            resetPasswordToken: token,
            resetPasswordExpires: expireTime
        }, {
            where: { email: email }
        });

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://http://127.0.0.1:5500/frontend/index.html?token=${token}`;

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

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confNewPassword } = req.body;

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