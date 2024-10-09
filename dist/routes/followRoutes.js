"use strict";
// src/routes/followRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const followController_1 = require("../controllers/followController");
const router = express_1.default.Router();
router.get('/following', (0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), followController_1.getFollowingUsers);
router.post('/users/:id/follow', (0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), followController_1.followUser);
router.delete('/users/:id/unfollow', (0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), followController_1.unfollowUser);
router.get('/users/:userId/followers', (0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), followController_1.getFollowersForUser);
exports.default = router;
