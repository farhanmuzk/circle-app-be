"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncWrapper_1 = require("../middleware/asyncWrapper");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const router = express_1.default.Router();
router.get("/allUser", (0, asyncWrapper_1.asyncWrapper)(userController_1.getAllUsers));
router.get("/me", auth_1.authenticateJWT, (0, asyncWrapper_1.asyncWrapper)(userController_1.getCurrentUser));
router.get("/:userId", auth_1.authenticateJWT, (0, asyncWrapper_1.asyncWrapper)(userController_1.getUserById));
router.put("/:userId", auth_1.authenticateJWT, multerMiddleware_1.upload.single("avatar"), (0, asyncWrapper_1.asyncWrapper)(userController_1.updateUserProfile));
exports.default = router;
