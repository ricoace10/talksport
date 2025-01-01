import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mediaType, mediaUrl, caption, authorId } = req.body;

  if (!mediaType || !mediaUrl || !authorId) {
    return res.status(400).json({ message: "Media type, media URL, and author ID are required" });
  }

  try {
    // Create post
    const post = await prisma.post.create({
      data: {
        mediaType,
        mediaUrl,
        caption,
        author: {
          connect: { id: authorId },
        },
      },
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
