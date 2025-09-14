import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/database.js';

import { User, Component, Project, ProjectComponent } from './models/index.js';

import authRoutes from './routes/auth.routes.js';
import componentRoutes from './routes/component.routes.js';
import projectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database connected...');

    await db.sync();
    console.log('All models were synchronized successfully.');
} catch (error) {
    console.error('Connection error:', error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));