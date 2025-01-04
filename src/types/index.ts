// types/index.ts
export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }
  
  export interface Post {
    id: number;
    mediaType: "IMAGE" | "VIDEO";
    mediaUrl: string;
    caption?: string;
    likes: number;
    isLiked: boolean;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  