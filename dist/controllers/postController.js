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
exports.createComment = exports.unlikePost = exports.likePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const postService = __importStar(require("../services/postService"));
const prisma_1 = __importDefault(require("@/config/prisma"));
// Create Post
const createPost = async (req, res) => {
    const { user: { id: authorId } = {} } = req;
    if (!authorId) {
        return res.status(401).json({ error: "Unauthorized. User ID is missing." });
    }
    const { text } = req.body;
    const image = req.file?.path;
    try {
        const post = await prisma_1.default.post.create({ data: { text, image, authorId } });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
};
exports.createPost = createPost;
// Get All Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error fetching posts",
            details: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
exports.getAllPosts = getAllPosts;
// Get Post By Id
const getPostById = async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error fetching post",
            details: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
exports.getPostById = getPostById;
// Like Post
const likePost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;
    if (!postId || isNaN(postId) || !userId) {
        return res.status(400).json({ error: "Invalid postId or userId" });
    }
    try {
        const existingLike = await prisma_1.default.like.findUnique({
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
    }
    catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({
            error: "Error liking post",
            details: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
exports.likePost = likePost;
// Unlike Post
const unlikePost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;
    if (!postId || isNaN(postId) || !userId) {
        return res.status(400).json({ error: "Invalid postId or userId" });
    }
    try {
        const deletedLike = await postService.unlikePost(postId, userId);
        if (deletedLike.count === 0) {
            return res.status(404).json({ error: "No like found for this post by this user" });
        }
        res.status(200).json({ message: "Post unliked" });
    }
    catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({
            error: "Error unliking post",
            details: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
exports.unlikePost = unlikePost;
// Create Comment
const createComment = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const { text } = req.body;
    const userId = req.user.id;
    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Comment text is required" });
    }
    const commentData = {
        text,
        postId,
        userId,
    };
    try {
        const newComment = await postService.createComment(commentData);
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating comment" });
    }
};
exports.createComment = createComment;
