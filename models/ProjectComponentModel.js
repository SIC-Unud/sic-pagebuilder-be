import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

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
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

export default ProjectComponent;