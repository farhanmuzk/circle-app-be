"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_URL = exports.EMAIL_PASS = exports.EMAIL_USER = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
exports.EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
exports.EMAIL_PASS = process.env.EMAIL_PASS || 'your-email-password';
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
