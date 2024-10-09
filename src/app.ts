import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes/index'; // Importing the combined routes

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// Serve static files from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Using the combined routes
app.use(routes);

export default app;
