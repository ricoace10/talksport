import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ message: "User ID and Post ID are required" });
  }

  try {
    // Check if user already liked the post
    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    // Add like
    const like = await prisma.like.create({
      data: {
        user: {
          connect: { id: userId },
        },
        post: {
          connect: { id: postId },
        },
      },
    });

    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
