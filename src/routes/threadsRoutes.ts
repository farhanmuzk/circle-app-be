import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { asyncWrapper } from "../middleware/asyncWrapper";
import {
    createPostController,
    getAllPostsController,
    getPostByIdController,
    createCommentController,
    likePostController,
    unlikePostController
  } from "../controllers/threadsController";

import {upload} from "../middleware/multerMiddleware"; // Ensure this is your multer config

const router = express.Router();

// POST Routes
// threadsRoutes.ts

router
  .route("/")
  .post(asyncWrapper(authenticateJWT), upload.single("image"), createPostController)
  .get(getAllPostsController);

router.route("/:postId").get(getPostByIdController);

router.route("/:postId/like").post(asyncWrapper(authenticateJWT), likePostController);

router
  .route("/:postId/unlike")
  .delete(asyncWrapper(authenticateJWT), unlikePostController);

router
  .route("/:postId/comments")
  .post(asyncWrapper(authenticateJWT), createCommentController);


export default router;
