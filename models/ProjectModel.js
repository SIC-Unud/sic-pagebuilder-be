import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Project = db.define('projects', {
    project_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default Project;