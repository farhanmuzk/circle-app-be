"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const threadsController_1 = require("../controllers/threadsController");
const multerMiddleware_1 = require("../middleware/multerMiddleware"); // Ensure this is your multer config
const router = express_1.default.Router();
// POST Routes
router
    .route("/")
    .post((0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), multerMiddleware_1.upload.single("image"), threadsController_1.createPost)
    .get(threadsController_1.getAllPosts);
router.route("/:postId").get(threadsController_1.getPostById);
// LIKE Routes
router.route("/:postId/like").post((0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), threadsController_1.likePost);
router
    .route("/:postId/unlike")
    .delete((0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), threadsController_1.unlikePost);
// COMMENT Routes
router
    .route("/:postId/comments")
    .post((0, asyncWrapper_1.asyncWrapper)(auth_1.authenticateJWT), threadsController_1.createComment);
exports.default = router;
