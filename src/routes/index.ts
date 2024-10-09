import { Router } from 'express';
import authRoutes from './authRoutes';
import postRoutes from './threadsRoutes';
import userRoutes from './userRoutes';
import followRoutes from './followRoutes';

const router = Router();

// Mounting individual route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/threads', postRoutes);
router.use('/', followRoutes);

export default router;
