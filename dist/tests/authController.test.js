"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../app")); // Lokasi file `app.ts` Anda
const jwtUtils_1 = require("../utils/jwtUtils");
describe('Auth Controller Tests', () => {
    // Test Register
    it('should register a new user successfully', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            email: 'testuser@example.com',
            username: 'testuser',
            password: 'password123',
            bio: 'This is a test bio',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
        expect(res.body.user).toHaveProperty('username', 'testuser');
        expect(res.body).toHaveProperty('token');
    });
    // Test Login
    it('should login a user with valid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: 'testuser@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
    it('should return error for invalid login credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: 'wrongemail@example.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
    // Test Forgot Password
    it('should send a reset password email', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/forgot-password')
            .send({
            email: 'testuser@example.com',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Reset password link sent to email');
    });
    it('should return error if email not found for forgot password', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/forgot-password')
            .send({
            email: 'nonexistent@example.com',
        });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });
    // Test Reset Password
    it('should reset password with valid token', async () => {
        // Generate a valid JWT token
        const token = jsonwebtoken_1.default.sign({ userId: 1 }, jwtUtils_1.jwtSecret, { expiresIn: '15m' }); // Sesuaikan userId dengan user yang ada
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/reset-password')
            .send({
            token,
            newPassword: 'newpassword123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Password updated successfully');
    });
    it('should return error for invalid reset password token', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/reset-password')
            .send({
            token: 'invalid-token',
            newPassword: 'newpassword123',
        });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Invalid or expired token');
    });
});
