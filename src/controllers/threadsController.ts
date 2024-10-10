import { Request, Response } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  unlikePost,
  createComment,
} from "../services/threadsService";
import { uploadImageToCloudinary } from "../services/cloudinaryService";
import { handleErrorResponse } from "../utils/handleErrorResponse";

// Create Post
export const createPostController = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { text } = req.body;
  const imageFile = req.file;

  try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile, "uploads/threads");
    }

    const post = await createPost({
      text,
      image: imageUrl,
      authorId: userId,
    });

    res.status(201).json(post);
  } catch (error) {
    handleErrorResponse(res, error, "Failed to create post");
  }
};

// Get All Posts
export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch posts");
  }
};

// Get Post by ID
export const getPostByIdController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  try {
    const post = await getPostById(postId);
    res.status(200).json(post);
  } catch (error) {
    handleErrorResponse(res, error, "Failed to fetch post by ID");
  }
};

// Like Post
export const likePostController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id;

  try {
    const newLike = await likePost(postId, userId);
    res.status(201).json(newLike);
  } catch (error) {
    handleErrorResponse(res, error, "Failed to like post");
  }
};

// Unlike Post
export const unlikePostController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const userId = (req as any).user.id;

  try {
    const result = await unlikePost(postId, userId);
    res.status(200).json({ message: "Post unliked", result });
  } catch (error) {
    handleErrorResponse(res, error, "Failed to unlike post");
  }
};

// Create Comment
export const createCommentController = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId);
  const { text } = req.body;
  const userId = (req as any).user.id;

  try {
    const comment = await createComment({
      text,
      postId,
      userId,
    });
    res.status(201).json(comment);
  } catch (error) {
    handleErrorResponse(res, error, "Failed to create comment");
  }
};

