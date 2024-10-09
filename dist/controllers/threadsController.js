"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = exports.unlikePost = exports.likePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const cloudinary_1 = require("cloudinary"); // Import Cloudinary
// Make sure to import these
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: "dvypl4sch", // Replace this with your Cloudinary cloud name
    api_key: "754623645455713", // Replace this with your Cloudinary API key
    api_secret: "GIRzDMbW4UKdZbUICHDLgO9gyv0", // Replace this with your Cloudinary API secret
    secure: true,
});
// Your existing createPost function
const createPost = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized. User ID is missing." });
    }
    const { text } = req.body;
    const imageFile = req.file; // Dapatkan file gambar yang diunggah
    try {
        let imageUrl = null;
        if (imageFile) {
            // Unggah gambar ke Cloudinary ke dalam folder "uploads/threads"
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: "image", // Pastikan ini adalah gambar
                    folder: "uploads/threads", // Tentukan folder "uploads/threads"
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(imageFile.buffer); // Kirim file buffer ke Cloudinary
            });
            imageUrl = result.secure_url; // Dapatkan URL aman dari Cloudinary
        }
        // Simpan data post ke database beserta URL gambar dari Cloudinary
        const post = await prisma_1.default.post.create({
            data: {
                text,
                image: imageUrl, // Gunakan URL gambar dari Cloudinary
                authorId: userId,
            },
        });
        res.status(201).json(post);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: error.message || "Failed to create post" });
        }
        else {
            console.error("Unknown error:", error);
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
exports.createPost = createPost;
// Get All Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await prisma_1.default.post.findMany({
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
    const postId = parseInt(req.params.postId); // Ambil ID dari parameter
    try {
        const post = await prisma_1.default.post.findUnique({
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
const likePost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id; // Ensure req.user.id is populated
    // Validate postId and userId
    if (!postId || isNaN(postId) || !userId) {
        return res.status(400).json({ error: "Invalid postId or userId" });
    }
    try {
        // Check if the like already exists using the correct unique input
        const existingLike = await prisma_1.default.like.findUnique({
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
        const newLike = await prisma_1.default.like.create({
            data: {
                postId,
                userId,
            },
        });
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
const unlikePost = async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;
    if (!postId || isNaN(postId) || !userId) {
        return res.status(400).json({ error: "Invalid postId or userId" });
    }
    try {
        const deletedLike = await prisma_1.default.like.deleteMany({
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
    const userId = req.user.id; // Get user ID from the authenticated user
    // Validate input
    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Comment text is required" });
    }
    try {
        const newComment = await prisma_1.default.comment.create({
            data: {
                text,
                postId,
                userId,
            },
        });
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating comment" });
    }
};
exports.createComment = createComment;
