// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userServices";
import { UpdateUserDto } from "../types/dtos/user.dto";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Current User
export const getCurrentUser = async (req: Request, res: Response) => {
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
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get User by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    const userId = decoded.userId;

    const { username, fullName, bio } = req.body;
    const avatar = req.file?.path;

    const updateData: UpdateUserDto = { username, fullName, bio, avatar };

    const updatedUser = await userService.updateUser(userId, updateData);
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
