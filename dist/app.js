"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index")); // Importing the combined routes
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
// Middleware JSON
app.use(express_1.default.json());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Using the combined routes
app.use(index_1.default);
exports.default = app;
