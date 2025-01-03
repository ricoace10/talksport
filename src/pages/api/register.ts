import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma"; // Adjust path to your prisma client

const registerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {
      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: "User already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Respond with success
      return res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "An error occurred while registering the user." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }
};

export default registerHandler;

