// DTO untuk Register
export interface RegisterDto {
    email: string;
    username: string;
    password: string;
    avatar?: string;
    bio?: string;
  }

  // DTO untuk Login
  export interface LoginDto {
    email: string;
    password: string;
  }

  // DTO untuk Forgot Password
  export interface ForgotPasswordDto {
    email: string;
  }

  // DTO untuk Reset Password
  export interface ResetPasswordDto {
    token: string;
    newPassword: string;
  }
