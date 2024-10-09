// src/types/PostDto.ts
export interface PostDto {
    text: string;
    image?: string | null; // optional image field
    authorId: number;
  }
