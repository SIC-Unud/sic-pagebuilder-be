import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model Project: Merepresentasikan tabel 'projects'.
 * Satu user bisa memiliki banyak project (One-to-Many).
 */
const Project = db.define('projects', {
    project_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false // Project harus punya pemilik
    }
}, {
    freezeTableName: true
});

export default Project;