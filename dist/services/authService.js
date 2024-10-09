"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const jwtUtils_1 = require("../utils/jwtUtils");
const emailUtils_1 = require("../utils/emailUtils");
const prisma = new client_1.PrismaClient();
const DEFAULT_AVATAR_URL = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
// Function to hash password
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 10);
};
// Function to generate JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, jwtUtils_1.jwtSecret, { expiresIn: "2h" });
};
const registerUser = async (data) => {
    const { email, username, password, avatar, bio } = data;
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });
    if (existingUser) {
        throw new Error("Email or username already in use");
    }
    const hashedPassword = await hashPassword(password);
    const userAvatar = avatar || DEFAULT_AVATAR_URL;
    const userBio = bio || null;
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            fullName: `user_${Math.floor(Math.random() * 100000)}`,
            avatar: userAvatar,
            bio: userBio,
        },
    });
    const token = generateToken(newUser.id);
    return { newUser, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, password: true } });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    return generateToken(user.id);
};
exports.loginUser = loginUser;
const forgotPassword = async (data) => {
    const { email } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtUtils_1.jwtSecret, { expiresIn: "15m" });
    await (0, emailUtils_1.sendResetPasswordEmail)(email, token);
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (data) => {
    const { token, newPassword } = data;
    const decoded = jsonwebtoken_1.default.verify(token, jwtUtils_1.jwtSecret);
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
    });
};
exports.resetPassword = resetPassword;
