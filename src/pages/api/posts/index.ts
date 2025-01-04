// pages/api/posts/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, MediaType } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // Fetch all posts, including author & likes
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          likes: true, // ensures each post has likes: []
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json({ success: true, data: posts });
    } else if (req.method === "POST") {
      // Create a new post
      const { authorId, mediaType, mediaUrl, caption } = req.body;

      if (!authorId || !mediaType || !mediaUrl) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (authorId, mediaType, mediaUrl).",
        });
      }

      // Validate mediaType: must be 'VIDEO' or 'PICTURE' (per your enum)
      if (!Object.values(MediaType).includes(mediaType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mediaType. Must be VIDEO or PICTURE.",
        });
      }

      const newPost = await prisma.post.create({
        data: {
          authorId,
          mediaType,
          mediaUrl,
          caption: caption || null,
        },
        include: {
          likes: true, // returns the newly created post's likes (empty array)
        },
      });

      return res.status(201).json({ success: true, data: newPost });
    } else {
      // Method not allowed
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
  } catch (error) {
    console.error("[POSTS] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
