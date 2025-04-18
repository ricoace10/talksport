import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, MediaType } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "talksport_token";

function getUserId(req: NextApiRequest): number | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const parsed = parse(raw);
  const token = parsed[COOKIE_NAME];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    
    if (req.method === "GET") {
      const posts = await prisma.post.findMany({
        include: { author: true, likes: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ success: true, data: posts });
    }

   
    if (req.method === "POST") {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { mediaType, mediaUrl, caption } = req.body;
      if (!mediaType || !mediaUrl) {
        return res.status(400).json({ success: false, message: "mediaType and mediaUrl required" });
      }
      if (!Object.values(MediaType).includes(mediaType)) {
        return res.status(400).json({ success: false, message: "Invalid mediaType" });
      }

      const newPost = await prisma.post.create({
        data: { authorId: userId, mediaType, mediaUrl, caption: caption || null },
        include: { likes: true },
      });

      return res.status(201).json({ success: true, data: newPost });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    console.error("[POSTS]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
