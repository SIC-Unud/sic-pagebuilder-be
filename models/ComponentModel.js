import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Component = db.define('components', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    category:{
        type: DataTypes.STRING
    },
    preview_url:{
        type: DataTypes.STRING
    },
    html_code:{
        type: DataTypes.TEXT,
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
    timestamps: false
});

export default Component;