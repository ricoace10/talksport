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
      // Fetch all posts (publicly visible; no auth check needed)
      const posts = await prisma.post.findMany({
        include: {
          author: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json({ success: true, data: posts });
    }

    if (req.method === "POST") {
      // 1) Accept fields from request body, including authorId
      const { authorId, mediaType, mediaUrl, caption } = req.body;

      // If your front-end is passing currentUser.id as "authorId", you can
      // have the correct ownership on each new post for the 3-dot menu.
      if (!authorId || !mediaType || !mediaUrl) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields (authorId, mediaType, mediaUrl).",
        });
      }

      // 2) Validate mediaType
      if (!Object.values(MediaType).includes(mediaType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid mediaType. Must be VIDEO or PICTURE.",
        });
      }

      // 3) Create the post with the supplied authorId
      const newPost = await prisma.post.create({
        data: {
          authorId,              // <--- use the authorId from the request
          mediaType,
          mediaUrl,
          caption: caption || null,
        },
        include: {
          likes: true,
        },
      });

      return res.status(201).json({ success: true, data: newPost });
    }

    // If neither GET nor POST
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  } catch (error) {
    console.error("[POSTS] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
