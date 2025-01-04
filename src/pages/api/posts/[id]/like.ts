// pages/api/posts/[id]/like.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const postId = parseInt(req.query.id as string);

    if (req.method === "POST") {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId is required.",
        });
      }

      // Check if post exists
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found.",
        });
      }

      // Check if like already exists
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        // If user already liked, remove the like (unlike)
        await prisma.like.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        return res.status(200).json({
          success: true,
          message: "Like removed (unliked).",
        });
      } else {
        // Otherwise, create a new like
        await prisma.like.create({
          data: {
            userId,
            postId,
          },
        });
        return res.status(201).json({
          success: true,
          message: "Post liked successfully.",
        });
      }
    } else {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
  } catch (error) {
    console.error("[LIKE] Error toggling like:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
