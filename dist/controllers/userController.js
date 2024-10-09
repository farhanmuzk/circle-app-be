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
exports.updateUserProfile = exports.getUserById = exports.getCurrentUser = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/userServices"));
const cloudinary_1 = require("cloudinary");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
cloudinary_1.v2.config({
    cloud_name: "dvypl4sch", // Replace with your Cloudinary cloud name
    api_key: "754623645455713", // Replace with your Cloudinary API key
    api_secret: "GIRzDMbW4UKdZbUICHDLgO9gyv0", // Replace with your Cloudinary API secret
    secure: true,
});
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
// Get Current User
const getCurrentUser = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = await userService.getCurrentUser(token);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
// Get User by ID
const getUserById = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId))
            return res.status(400).json({ error: "Invalid user ID" });
        const user = await userService.getUserById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserById = getUserById;
// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Unauthorized" });
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const userId = decoded.userId;
        const { username, fullName, bio } = req.body;
        const avatarFile = req.file; // Get the uploaded avatar file
        let avatarUrl = null;
        if (avatarFile) {
            // Upload avatar to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: "image", // Ensure it's an image
                    folder: "uploads/users", // Specify the folder for avatar uploads
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(avatarFile.buffer); // Send the file buffer to Cloudinary
            });
            avatarUrl = result.secure_url; // Get the secure URL from Cloudinary
        }
        // Update user data with or without avatar URL
        const updateData = {
            username,
            fullName,
            bio,
            ...(avatarUrl && { avatar: avatarUrl }), // If avatarUrl exists, include it
        };
        // Call the user service to update the user data
        const updatedUser = await userService.updateUser(userId, updateData);
        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
