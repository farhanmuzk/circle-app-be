"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const threadsRoutes_1 = __importDefault(require("./threadsRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const followRoutes_1 = __importDefault(require("./followRoutes"));
const router = (0, express_1.Router)();
// Mounting individual route modules
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/threads', threadsRoutes_1.default);
router.use('/', followRoutes_1.default);
exports.default = router;
