"use strict";
// src/services/followService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.unfollowUser = exports.checkExistingFollow = exports.getFollowersForUser = exports.getFollowingUsers = void 0;
const client_1 = require("@prisma/client");
const jwtUtils_1 = require("../utils/jwtUtils");
const prisma = new client_1.PrismaClient();
// Get Following Users
const getFollowingUsers = async (token) => {
    const decoded = (0, jwtUtils_1.verifyToken)(token);
    if (!decoded)
        throw new Error("Unauthorized");
    return await prisma.follow.findMany({
        where: { followerId: decoded.userId },
        include: {
            following: {
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });
};
exports.getFollowingUsers = getFollowingUsers;
// Get Followers for User
const getFollowersForUser = async (userId) => {
    return await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
            follower: {
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });
};
exports.getFollowersForUser = getFollowersForUser;
// Check Existing Follow
const checkExistingFollow = async (followerId, followingId) => {
    return await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });
};
exports.checkExistingFollow = checkExistingFollow;
// Unfollow User
const unfollowUser = async (followerId, followingId) => {
    return await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });
};
exports.unfollowUser = unfollowUser;
// Follow User
const followUser = async (followerId, followingId) => {
    const followData = { followerId, followingId }; // Using the DTO
    return await prisma.follow.create({
        data: followData,
    });
};
exports.followUser = followUser;
