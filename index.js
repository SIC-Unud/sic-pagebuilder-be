import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/database.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import componentRoutes from './routes/component.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import projectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');

        await db.sync({ alter: true });

    } catch (error) {
        console.error('Connection error:', error);
    }

    app.use(cors());
    app.use(express.json());

    app.use('/auth', authRoutes);
    // app.use('/api/components', componentRoutes); // Nyalakan jika file routes sudah siap
    // app.use('/api/projects', projectRoutes);     // Nyalakan jika file routes sudah siap
    // app.use('/api/users', userRoutes);           // Nyalakan jika file routes sudah siap
    // app.use('/api/dashboard', dashboardRoutes);  // Nyalakan jika file routes sudah siap

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();