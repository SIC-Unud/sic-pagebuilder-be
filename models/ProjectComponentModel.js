import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model Pivot (Penghubung): Many-to-Many antara Project dan Component.
 * Menyimpan informasi komponen apa saja yang ada di dalam sebuah project,
 * beserta urutannya (order).
 */
const ProjectComponent = db.define('project_components', {
    project_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    component_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order:{
        type: DataTypes.INTEGER, // Menentukan posisi urutan komponen di halaman
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default ProjectComponent;