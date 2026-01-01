import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model User: Merepresentasikan tabel 'users' di database.
 * Menyimpan data otentikasi dan profil pengguna.
 */
const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false // Wajib diisi
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Tidak boleh ada email kembar
        validate: {
            isEmail: true // Validasi format email otomatis
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user' // Default role adalah 'user' biasa
    },
    // Field untuk fitur Lupa Password
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    }
}, {
    freezeTableName: true // Nama tabel tetap 'users'
});

export default User;