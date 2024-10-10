import prisma from "../config/prisma";
import { PostDto } from "../types/dto/post.dto";
import { CommentDto } from "../types/dto/comment.dto";

// Create Post
export const createPost = async (data: PostDto) => {
  try {
    return await prisma.post.create({ data });
  } catch (error) {
    throw new Error("Error creating post");
  }
};

// Get All Posts
export const getAllPosts = async () => {
  try {
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
  } catch (error) {
    throw new Error("Error fetching posts");
  }
};

// Get Post By Id
export const getPostById = async (postId: number) => {
  try {
    const post = await prisma.post.findUnique({
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

    if (!post) throw new Error("Post not found");
    return post;
  } catch (error) {
    throw new Error("Error fetching post");
  }
};

// Like Post
export const likePost = async (postId: number, userId: number) => {
  try {
    return await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  } catch (error) {
    throw new Error("Error liking post");
  }
};

// Unlike Post
export const unlikePost = async (postId: number, userId: number) => {
  try {
    return await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });
  } catch (error) {
    throw new Error("Error unliking post");
  }
};

// Create Comment
export const createComment = async (data: CommentDto) => {
  try {
    return await prisma.comment.create({
      data,
    });
  } catch (error) {
    throw new Error("Error creating comment");
  }
};
