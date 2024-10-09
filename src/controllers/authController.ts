import { Request, Response } from "express";
import { registerUser, loginUser, forgotPassword as forgotPasswordService, resetPassword as resetPasswordService} from "../services/authService";
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from "../types/dtos/auth.dto";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const data: RegisterDto = req.body;

  try {
    const { newUser, token } = await registerUser(data);
    return res.status(201).json({ user: newUser, token });
  } catch (error: any) {
    console.error("Error during registration:", error);
    return res.status(400).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const data: LoginDto = req.body;

  try {
    const token = await loginUser(data);
    return res.status(200).json({ token });
  } catch (error: any) {
    console.error("Error during login:", error);
    return res.status(400).json({ error: error.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
    const data: ForgotPasswordDto = req.body;

    try {
      await forgotPasswordService(data);
      return res.status(200).json({ message: "Reset password link sent to email" });
    } catch (error: any) {
      console.error("Error during forgot password:", error);
      return res.status(500).json({ error: "Error sending email" });
    }
  };

  // RESET PASSWORD
  export const resetPassword = async (req: Request, res: Response) => {
    const data: ResetPasswordDto = req.body;

    try {
      await resetPasswordService(data);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
      console.error("Error during reset password:", error);
      return res.status(403).json({ error: "Invalid or expired token." });
    }
  };
