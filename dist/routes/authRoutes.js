"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Rute untuk register user baru
router.post('/register', authController_1.register);
// Rute untuk login
router.post('/login', authController_1.login);
// Rute untuk lupa password
router.post('/forgot-password', authController_1.forgotPassword);
// Rute untuk reset password
router.post('/reset-password', authController_1.resetPassword);
exports.default = router;
