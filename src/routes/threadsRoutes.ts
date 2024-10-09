import express from "express";
import { authenticateJWT } from "../middleware/auth";
import { asyncWrapper } from "../middleware/asyncWrapper";
import {
  createPost,
  getAllPosts,
  getPostById,
  createComment,
  likePost,
  unlikePost,
} from "../controllers/threadsController";
import { upload } from "../middleware/multerMiddleware";

const router = express.Router();

// POST Routes
router
  .route("/")
  .post(asyncWrapper(authenticateJWT), upload.single("image"), createPost)
  .get(getAllPosts); 

router.route("/:postId").get(getPostById);

// LIKE Routes
router.route("/:postId/like").post(asyncWrapper(authenticateJWT), likePost);

router
  .route("/:postId/unlike")
  .delete(asyncWrapper(authenticateJWT), unlikePost);

// COMMENT Routes
router
  .route("/:postId/comments")
  .post(asyncWrapper(authenticateJWT), createComment);

export default router;
