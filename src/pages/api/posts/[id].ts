import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "talksport_token";

function getUserId(req: NextApiRequest): number | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const token = parse(raw)[COOKIE_NAME];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postId = Number(req.query.id);

  if (Number.isNaN(postId)) {
    return res.status(400).json({ success: false, message: "Invalid post id" });
  }

  try {
    if (req.method === "PUT" || req.method === "DELETE") {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const existing = await prisma.post.findUnique({ where: { id: postId } });
      if (!existing) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
      if (existing.authorId !== userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      if (req.method === "PUT") {
        const { caption } = req.body as { caption?: string };
        const updated = await prisma.post.update({
          where: { id: postId },
          data: { caption },
          include: { likes: true, author: true },
        });
        return res.status(200).json({ success: true, data: updated });
      }

      // DELETE
      await prisma.post.delete({ where: { id: postId } });
      return res.status(200).json({ success: true, message: "Post deleted" });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    console.error("[POST /id]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
