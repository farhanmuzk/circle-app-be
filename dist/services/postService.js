"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.unlikePost = exports.likePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
// src/services/postService.ts
const prisma_1 = __importDefault(require("../config/prisma"));
// Create Post
const createPost = async (data) => {
    return await prisma_1.default.post.create({
        data,
    });
};
exports.createPost = createPost;
// Get All Posts
const getAllPosts = async () => {
    return await prisma_1.default.post.findMany({
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
exports.getAllPosts = getAllPosts;
// Get Post By Id
const getPostById = async (postId) => {
    return await prisma_1.default.post.findUnique({
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
exports.getPostById = getPostById;
// Like Post
const likePost = async (postId, userId) => {
    return await prisma_1.default.like.create({
        data: {
            postId,
            userId,
        },
    });
};
exports.likePost = likePost;
// Unlike Post
const unlikePost = async (postId, userId) => {
    return await prisma_1.default.like.deleteMany({
        where: {
            postId,
            userId,
        },
    });
};
exports.unlikePost = unlikePost;
// Create Comment
const createComment = async (data) => {
    return await prisma_1.default.comment.create({
        data,
    });
};
exports.createComment = createComment;
