import { Request, Response } from "express";
import prisma from "../config/prisma";

// Create Post
export const createPost = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id; 
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. User ID is missing." });
  }

  const { text } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const post = await prisma.post.create({
      data: {
        text,
        image: imageUrl,
        authorId: userId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get All Posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
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
  const postId = parseInt(req.params.postId); // Ambil ID dari parameter

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

    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // Jika tidak ditemukan, kembalikan status 404
    }

    res.status(200).json(post); // Kembalikan post jika ditemukan
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error fetching post",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id; // Ensure req.user.id is populated

  // Validate postId and userId
  if (!postId || isNaN(postId) || !userId) {
    return res.status(400).json({ error: "Invalid postId or userId" });
  }

  try {
    // Check if the like already exists using the correct unique input
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          // Use userId_postId for the composite key
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: "Post already liked by this user" });
    }

    const newLike = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    res.status(201).json(newLike);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({
        error: "Error liking post",
        details:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id;

  if (!postId || isNaN(postId) || !userId) {
    return res.status(400).json({ error: "Invalid postId or userId" });
  }

  try {
    const deletedLike = await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    // Check if any like was deleted
    if (deletedLike.count === 0) {
      return res
        .status(404)
        .json({ error: "No like found for this post by this user" });
    }

    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({
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
  const userId = (req as any).user.id; // Get user ID from the authenticated user

  // Validate input
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        postId,
        userId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating comment" });
  }
};
