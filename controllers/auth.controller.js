import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {};

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

        const match = await bcrypt.compare(req.body.password, user.password);

        if (!match) {
            return res.status(400).json({ msg: "Password salah" });
        }

        const userId = user.id;
        const name = user.name;
        const username = user.username;
        const email = user.email;
        const role = user.role;

        const accessToken = jwt.sign({ userId, name, username, email, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ accessToken });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const forgotPassword = (req, res) => {};

export const resetPassword = (req, res) => {};