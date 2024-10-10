import express from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { getUserById, getAllUsers, getCurrentUser, updateUserProfile } from "../controllers/userController";
import { upload } from "../middleware/multerMiddleware";

const router = express.Router();

router.get("/allUser", asyncWrapper(getAllUsers));
router.get("/me", authenticateJWT, asyncWrapper(getCurrentUser));
router
    .route("/:userId")
    .get(asyncWrapper(authenticateJWT), getUserById)
    .put(asyncWrapper(authenticateJWT), upload.single("avatar"), updateUserProfile );

export default router;
