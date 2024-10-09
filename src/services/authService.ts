import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { jwtSecret } from "../utils/jwtUtils";
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "../types/dtos/auth.dto";
import { sendResetPasswordEmail } from "../utils/emailUtils";

const prisma = new PrismaClient();
const DEFAULT_AVATAR_URL = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";

// Function to hash password
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Function to generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "2h" });
};

export const registerUser = async (data: RegisterDto) => {
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

export const loginUser = async (data: LoginDto) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, password: true } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return generateToken(user.id);
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const { email } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "15m" });
  await sendResetPasswordEmail(email, token);
};

export const resetPassword = async (data: ResetPasswordDto) => {
  const { token, newPassword } = data;

  const decoded = jwt.verify(token, jwtSecret) as { userId: number };
  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { password: hashedPassword },
  });
};
