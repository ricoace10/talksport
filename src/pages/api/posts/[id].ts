// pages/api/posts/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = parseInt(req.query.id as string);

  try {
    switch (req.method) {
      case "GET":
        // Fetch single post
        const post = await prisma.post.findUnique({
          where: { id: postId },
          include: { likes: true, author: true },
        });
        if (!post) {
          return res
            .status(404)
            .json({ success: false, message: "Post not found." });
        }
        return res.status(200).json({ success: true, data: post });

      case "PUT":
        // Update post caption
        const { caption } = req.body;
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: {
            caption: caption,
          },
          include: { likes: true, author: true },
        });
        return res.status(200).json({ success: true, data: updatedPost });

      case "DELETE":
        // Delete the post
        await prisma.post.delete({
          where: { id: postId },
        });
        return res.status(200).json({ success: true, message: "Post deleted." });

      default:
        return res
          .status(405)
          .json({ success: false, message: "Method not allowed." });
    }
  } catch (error) {
    console.error("[POST /id] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
