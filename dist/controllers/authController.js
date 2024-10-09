"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
// REGISTER
const register = async (req, res) => {
    const data = req.body;
    try {
        const { newUser, token } = await (0, authService_1.registerUser)(data);
        return res.status(201).json({ user: newUser, token });
    }
    catch (error) {
        console.error("Error during registration:", error);
        return res.status(400).json({ error: error.message });
    }
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    const data = req.body;
    try {
        const token = await (0, authService_1.loginUser)(data);
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(400).json({ error: error.message });
    }
};
exports.login = login;
// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    const data = req.body;
    try {
        await (0, authService_1.forgotPassword)(data);
        return res.status(200).json({ message: "Reset password link sent to email" });
    }
    catch (error) {
        console.error("Error during forgot password:", error);
        return res.status(500).json({ error: "Error sending email" });
    }
};
exports.forgotPassword = forgotPassword;
// RESET PASSWORD
const resetPassword = async (req, res) => {
    const data = req.body;
    try {
        await (0, authService_1.resetPassword)(data);
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error during reset password:", error);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
exports.resetPassword = resetPassword;
