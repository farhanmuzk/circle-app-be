"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.jwtSecret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Impor jsonwebtoken
exports.jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
// Fungsi untuk membuat JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, exports.jwtSecret, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
// Fungsi untuk memverifikasi JWT token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, exports.jwtSecret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Token has expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        else {
            throw new Error('Token verification failed');
        }
    }
};
exports.verifyToken = verifyToken;
