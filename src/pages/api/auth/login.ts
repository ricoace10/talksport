import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;             
const COOKIE_NAME = "talksport_token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "2h" });


    res.setHeader(
      "Set-Cookie",
      serialize(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 2,         
      })
    );

    const { password: _pw, ...userWithoutPassword } = user;
    return res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (err) {
    console.error("[LOGIN]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
