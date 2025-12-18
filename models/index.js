import User from "./UserModel.js";
import Component from "./ComponentModel.js";
import Project from "./ProjectModel.js";
import ProjectComponent from "./ProjectComponentModel.js";

// Definisi Relasi
User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.belongsToMany(Component, { through: ProjectComponent, foreignKey: 'project_id' });
Component.belongsToMany(Project, { through: ProjectComponent, foreignKey: 'component_id' });

export { User, Component, Project, ProjectComponent };