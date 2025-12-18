import User from "./UserModel.js";
import Component from "./ComponentModel.js";
import Project from "./ProjectModel.js";
import ProjectComponent from "./ProjectComponentModel.js";
import express from 'express';

const authRoutes = require('./routes/auth.routes.js');

const app = express;

app.use('/api/auth', authRoutes);

User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.belongsToMany(Component, { through: ProjectComponent, foreignKey: 'project_id' });
Component.belongsToMany(Project, { through: ProjectComponent, foreignKey: 'component_id' });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

export { User, Component, Project, ProjectComponent };