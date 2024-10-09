// src/services/followService.ts

import { PrismaClient } from "@prisma/client";
import { FollowDto } from "../types/dtos/follow.dto";
import { verifyToken } from "../utils/jwtUtils";
const prisma = new PrismaClient();

// Get Following Users
export const getFollowingUsers = async (token: string) => {
  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Unauthorized");

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

// Get Followers for User
export const getFollowersForUser = async (userId: number) => {
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

// Check Existing Follow
export const checkExistingFollow = async (followerId: number, followingId: number) => {
  return await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

// Unfollow User
export const unfollowUser = async (followerId: number, followingId: number) => {
  return await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

// Follow User
export const followUser = async (followerId: number, followingId: number) => {
  const followData: FollowDto = { followerId, followingId }; // Using the DTO
  return await prisma.follow.create({
    data: followData,
  });
};
