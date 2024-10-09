import express from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { authenticateJWT } from "../middleware/auth";
import { getUserById, getAllUsers, getCurrentUser, updateUserProfile,  } from "../controllers/userController";
import { upload } from "../middleware/multerMiddleware";

const router = express.Router();

router.get("/allUser", asyncWrapper(getAllUsers));
router.get("/me", authenticateJWT, asyncWrapper(getCurrentUser));
router.get("/:userId", authenticateJWT, asyncWrapper(getUserById));
router.put("/:userId", authenticateJWT, upload.single("avatar"), asyncWrapper(updateUserProfile));

export default router;
