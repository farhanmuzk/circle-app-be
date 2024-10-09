"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // Memanggil jwt.verify dan memberikan fungsi callback dengan tipe yang benar
        jsonwebtoken_1.default.verify(token, jwtUtils_1.jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden. Invalid token." });
            }
            // Pastikan user bukan undefined dan memiliki userId
            if (user && typeof user !== 'string' && 'userId' in user) {
                req.user = { id: user.userId }; // Menyimpan userId ke req.user
                console.log("Authenticated user:", user); // Log untuk debugging
                next();
            }
            else {
                return res.status(401).json({ error: "Unauthorized. User ID is missing." });
            }
        });
    }
    else {
        res.status(401).json({ error: "Unauthorized. Token is missing." });
    }
};
exports.authenticateJWT = authenticateJWT;
