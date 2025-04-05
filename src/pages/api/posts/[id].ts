// pages/api/posts/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Convert postId query param to integer
  const postId = parseInt(req.query.id as string, 10);

  try {
    switch (req.method) {
      case "GET": {
        // Not implemented
        return res.status(405).json({
          success: false,
          message: "GET not implemented. Use /api/posts for listing all posts.",
        });
      }

      case "PUT": {
        // Grab userId & caption from request body
        const { userId, caption } = req.body;

        // Convert userId to number in case it's a string
        const numericUserId = Number(userId);
        if (!numericUserId) {
          return res.status(400).json({
            success: false,
            message: "Missing or invalid userId in request body.",
          });
        }

        // Find existing post
        const existingPost = await prisma.post.findUnique({
          where: { id: postId },
          include: { likes: true, author: true },
        });

        if (!existingPost) {
          return res.status(404).json({
            success: false,
            message: "Post not found.",
          });
        }

        // Ownership check
        if (existingPost.authorId !== numericUserId) {
          return res.status(403).json({
            success: false,
            message: "Forbidden. You are not the author of this post.",
          });
        }

        // Update the post
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { caption },
          include: { likes: true, author: true },
        });

        return res.status(200).json({
          success: true,
          data: updatedPost,
        });
      }

      case "DELETE": {
        // Grab userId from request body
        const { userId } = req.body;

        // Convert userId to number in case it's a string
        const numericUserId = Number(userId);
        if (!numericUserId) {
          return res.status(400).json({
            success: false,
            message: "Missing or invalid userId in request body.",
          });
        }

        // Find existing post
        const existingPost = await prisma.post.findUnique({
          where: { id: postId },
        });

        if (!existingPost) {
          return res.status(404).json({
            success: false,
            message: "Post not found.",
          });
        }

        // Ownership check
        if (existingPost.authorId !== numericUserId) {
          return res.status(403).json({
            success: false,
            message: "Forbidden. You are not the author of this post.",
          });
        }

        // Delete the post
        await prisma.post.delete({
          where: { id: postId },
        });

        return res.status(200).json({
          success: true,
          message: "Post deleted.",
        });
      }

      default: {
        // Any other method is not allowed
        return res.status(405).json({
          success: false,
          message: "Method not allowed.",
        });
      }
    }
  } catch (error) {
    console.error("[POST /id] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
