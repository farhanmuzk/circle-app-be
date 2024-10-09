// src/routes/followRoutes.ts

import express from 'express';
import { authenticateJWT } from '../middleware/auth';
import { asyncWrapper } from '../middleware/asyncWrapper';
import { followUser, getFollowersForUser, getFollowingUsers, unfollowUser } from '../controllers/followController';

const router = express.Router();

router.get('/following', asyncWrapper(authenticateJWT), getFollowingUsers);

router.post('/users/:id/follow', asyncWrapper(authenticateJWT), followUser);
router.delete('/users/:id/unfollow', asyncWrapper(authenticateJWT), unfollowUser);

router.get('/users/:userId/followers', asyncWrapper(authenticateJWT), getFollowersForUser);


export default router;
