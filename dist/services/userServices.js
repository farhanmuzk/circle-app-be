"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getCurrentUser = exports.getUserById = exports.getAllUsers = void 0;
// src/services/userService.ts
const prisma_1 = __importDefault(require("../config/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
// Get All Users
const getAllUsers = async () => {
    return await prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            bio: true,
            avatar: true,
            createdAt: true,
        },
    });
};
exports.getAllUsers = getAllUsers;
// Get User by ID
const getUserById = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            bio: true,
            avatar: true,
            createdAt: true,
            followingUsers: { select: { followingId: true } },
            followersUsers: { select: { followerId: true } },
        },
    });
    if (!user)
        return null;
    const followingCount = user.followingUsers.length;
    const followerCount = user.followersUsers.length;
    return {
        ...user,
        followingCount,
        followerCount,
    };
};
exports.getUserById = getUserById;
// Get Current User
const getCurrentUser = async (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
    const user = await prisma_1.default.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            bio: true,
            avatar: true,
            createdAt: true,
            followingUsers: { select: { followingId: true } },
            followersUsers: { select: { followerId: true } },
        },
    });
    if (!user)
        return null;
    const followingCount = user.followingUsers.length;
    const followerCount = user.followersUsers.length;
    return {
        ...user,
        followingCount,
        followerCount,
    };
};
exports.getCurrentUser = getCurrentUser;
// Update User Profile
const updateUser = async (userId, updateData) => {
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: updateData,
    });
};
exports.updateUser = updateUser;
