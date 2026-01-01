import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model Component: Master data elemen UI (Navbar, Hero, dll).
 * Dikelola oleh Admin, digunakan oleh User.
 */
const Component = db.define('components', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    category:{
        type: DataTypes.STRING // Kategori: 'navbar', 'footer', 'card', dll.
    },
    preview_url:{
        type: DataTypes.STRING // Link gambar preview (opsional)
    },
    html_code:{
        type: DataTypes.TEXT, // Menggunakan TEXT untuk string panjang
        allowNull: false
    },
    css_code:{
        type: DataTypes.TEXT
    },
    js_code:{
        type: DataTypes.TEXT
    },
}, {
    freezeTableName: true,
    timestamps: false // Tidak butuh createdAt/updatedAt untuk master data ini
});

export default Component;