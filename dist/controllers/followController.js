"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.unfollowUser = exports.getFollowersForUser = exports.getFollowingUsers = void 0;
const followService = __importStar(require("../services/followService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtUtils_1 = require("../utils/jwtUtils");
// Get Following Users
const getFollowingUsers = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const following = await followService.getFollowingUsers(token);
        return res.status(200).json(following.map((f) => f.following));
    }
    catch (error) {
        console.error("Error fetching following users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getFollowingUsers = getFollowingUsers;
// Get Followers For User
const getFollowersForUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const followers = await followService.getFollowersForUser(parseInt(userId));
        return res.status(200).json(followers.map((f) => f.follower));
    }
    catch (error) {
        console.error("Error fetching followers:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getFollowersForUser = getFollowersForUser;
// Unfollow User
const unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.id);
    try {
        const existingFollow = await followService.checkExistingFollow(followerId, followingId);
        if (!existingFollow) {
            return res.status(400).json({ error: "You are not following this user" });
        }
        await followService.unfollowUser(followerId, followingId);
        res.status(200).json({ message: "Successfully unfollowed the user" });
    }
    catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({ error: "Error unfollowing user" });
    }
};
exports.unfollowUser = unfollowUser;
// Follow User
const followUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtUtils_1.jwtSecret);
        const followerId = decoded.userId;
        const followingId = parseInt(req.params.id);
        const existingFollow = await followService.checkExistingFollow(followerId, followingId);
        if (existingFollow) {
            await followService.unfollowUser(followerId, followingId);
            return res.status(200).json({ message: "Unfollowed successfully" });
        }
        else {
            await followService.followUser(followerId, followingId); // Using the followUser method
            return res.status(200).json({ message: "Followed successfully" });
        }
    }
    catch (error) {
        console.error("Error following user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.followUser = followUser;
