// src/services/postService.ts
import prisma from "../config/prisma";
import { PostDto } from "../types/dtos/post.dto";
import { CommentDto } from "../types/dtos/comment.dto";

// Create Post
export const createPost = async (data: PostDto) => {
  return await prisma.post.create({
    data,
  });
};

// Get All Posts
export const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          username: true,
          fullName: true,
          avatar: true,
        },
      },
      likes: true,
      comments: {
        include: { user: { select: { username: true, avatar: true } } },
      },
    },
  });
};

// Get Post By Id
export const getPostById = async (postId: number) => {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          username: true,
          fullName: true,
          avatar: true,
        },
      },
      likes: true,
      comments: {
        include: { user: { select: { username: true, avatar: true } } },
      },
    },
  });
};

// Like Post
export const likePost = async (postId: number, userId: number) => {
  return await prisma.like.create({
    data: {
      postId,
      userId,
    },
  });
};

// Unlike Post
export const unlikePost = async (postId: number, userId: number) => {
  return await prisma.like.deleteMany({
    where: {
      postId,
      userId,
    },
  });
};

// Create Comment
export const createComment = async (data: CommentDto) => {
  return await prisma.comment.create({
    data,
  });
};
