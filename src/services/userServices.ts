// src/services/userService.ts
import prisma from "../config/prisma";
import { UserDto, UserProfileDto, UpdateUserDto } from "../types/dto/user.dto";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Get All Users
export const getAllUsers = async (): Promise<UserDto[]> => {
  return await prisma.user.findMany({
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

// Get User by ID
export const getUserById = async (userId: number): Promise<UserProfileDto | null> => {
  const user = await prisma.user.findUnique({
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

  if (!user) return null;

  const followingCount = user.followingUsers.length;
  const followerCount = user.followersUsers.length;

  return {
    ...user,
    followingCount,
    followerCount,
  };
};

// Get Current User
export const getCurrentUser = async (token: string): Promise<UserProfileDto | null> => {
  const decoded = jwt.verify(token, jwtSecret) as { userId: number };

  const user = await prisma.user.findUnique({
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

  if (!user) return null;

  const followingCount = user.followingUsers.length;
  const followerCount = user.followersUsers.length;

  return {
    ...user,
    followingCount,
    followerCount,
  };
};

// Update User Profile
export const updateUser = async (userId: number, updateData: UpdateUserDto): Promise<UserDto> => {
  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};
