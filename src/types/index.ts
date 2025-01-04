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
    mediaType: "PICTURE" | "VIDEO";
    mediaUrl: string;
    caption?: string;
    likes: Like[];
    isLiked: boolean;
    authorId: string | number ;
  }

  interface Like {
    userId: number;
    postId: number;
  } 
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
export type MediaType = "VIDEO" | "PICTURE";
