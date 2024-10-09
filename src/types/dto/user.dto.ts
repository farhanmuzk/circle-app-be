// src/dto/user.dto.ts

// DTO for the basic user information
export interface UserDto {
    id: number;
    email: string;
    username: string;
    fullName: string;
    bio: string | null;
    avatar: string;
    createdAt: Date;
  }

  // DTO for the user's profile with additional follower and following counts
  export interface UserProfileDto extends UserDto {
    followingCount: number;
    followerCount: number;
  }

  // DTO for updating the user's information
  export interface UpdateUserDto {
    username?: string;  // Optional: The username may or may not be provided
    fullName?: string;  // Optional: The full name may or may not be provided
    bio?: string;       // Optional: The bio may or may not be provided
    avatar?: string;    // Optional: The avatar URL or path may or may not be provided
  }
