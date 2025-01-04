// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Please use POST.",
    });
  }

  try {
    // Rename the request-body 'password' to avoid re-declaration
    const { name, email, password: rawPassword } = req.body as RegisterRequestBody;

    // Basic validation
    if (!name || !email || !rawPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, or password.",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    // Return user data without the password
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("[REGISTER] Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
}
