import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Memuat variabel dari file .env

/**
 * Konfigurasi koneksi database MySQL menggunakan Sequelize ORM.
 * Pastikan variabel di .env sudah sesuai.
 */
const db = new Sequelize(
    process.env.DB_NAME, // Nama Database
    process.env.DB_USER, // Username Database (ex: root)
    process.env.DB_PASSWORD, // Password Database
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Port default: 3306
        dialect: 'mysql'
    }
);

export default db;