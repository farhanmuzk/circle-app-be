// src/controllers/postController.ts
import { Request, Response } from "express";
import * as postService from "../services/threadsService";
import { PostDto } from "../types/dto/post.dto";
import { CommentDto } from "../types/dto/comment.dto";
import prisma from "@/config/prisma";

// Create Post
export const createPost = async (req: Request, res: Response) => {
  const { user: { id: authorId } = {} } = req as any;
  if (!authorId) {
    return res.status(401).json({ error: "Unauthorized. User ID is missing." });
  }

  const { text } = req.body;
  const image = req.file?.path;

  try {
    const post = await prisma.post.create({ data: { text, image, authorId } });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get All Posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error fetching posts",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Get Post By Id
export const getPostById = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);

  try {
    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error fetching post",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Like Post
export const likePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id;

  if (!postId || isNaN(postId) || !userId) {
    return res.status(400).json({ error: "Invalid postId or userId" });
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: "Post already liked by this user" });
    }

    const newLike = await postService.likePost(postId, userId);
    res.status(201).json(newLike);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      error: "Error liking post",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Unlike Post
export const unlikePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id;

  if (!postId || isNaN(postId) || !userId) {
    return res.status(400).json({ error: "Invalid postId or userId" });
  }

  try {
    const deletedLike = await postService.unlikePost(postId, userId);

    if (deletedLike.count === 0) {
      return res.status(404).json({ error: "No like found for this post by this user" });
    }

    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({
      error: "Error unliking post",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Create Comment
export const createComment = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const { text } = req.body;
  const userId = (req as any).user.id;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const commentData: CommentDto = {
    text,
    postId,
    userId,
  };

  try {
    const newComment = await postService.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating comment" });
  }
};
