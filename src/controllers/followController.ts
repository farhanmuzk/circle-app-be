// src/controllers/followController.ts
import { Request, Response } from "express";
import * as followService from "../services/followService";
import jwt from 'jsonwebtoken';
import { jwtSecret } from "../utils/jwtUtils";

// Get Following Users
export const getFollowingUsers = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const following = await followService.getFollowingUsers(token);
    return res.status(200).json(following.map((f) => f.following));
  } catch (error) {
    console.error("Error fetching following users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Followers For User
export const getFollowersForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followers = await followService.getFollowersForUser(parseInt(userId));
    return res.status(200).json(followers.map((f) => f.follower));
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Unfollow User
export const unfollowUser = async (req: Request, res: Response) => {
  const followerId = (req as any).user.id;
  const followingId = parseInt(req.params.id);

  try {
    const existingFollow = await followService.checkExistingFollow(followerId, followingId);

    if (!existingFollow) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    await followService.unfollowUser(followerId, followingId);
    res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Error unfollowing user" });
  }
};

// Follow User
export const followUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    const followerId = decoded.userId;
    const followingId = parseInt(req.params.id);

    const existingFollow = await followService.checkExistingFollow(followerId, followingId);

    if (existingFollow) {
      await followService.unfollowUser(followerId, followingId);
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await followService.followUser(followerId, followingId); // Using the followUser method
      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
