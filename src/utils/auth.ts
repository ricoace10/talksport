import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

/**
 * Minimal example of extracting a user object from a JWT token in the request header.
 * Adjust for your actual secret key, payload structure, etc.
 */
export function authenticateUser(req: NextApiRequest) {
  try {
    // Expecting header "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    // Use your real secret in .env, e.g. process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET ||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTZjNTFlMWEtN2I2Ny00MjVjLTk0ZWUtYmNkMjUxOWMwNmU3IiwidGVuYW50X2lkIjoiN2EwZDhmZGZmMWNiN2VkMjFiNmEwNTIyNGEwMDEyMWRkMGM3YmYxNGRjZTdjYjY2ZTI4YTNhYzZmNzMxMmRkMSIsImludGVybmFsX3NlY3JldCI6ImIzMDQyOGE0LTIxMTktNDJiYy1iMmY2LTI5Y2YzZjJkNWIxZSJ9.Qcc7GDqiHCnssjuil-VaJL3sHWM4DZrNP2GIudnqxbg";

    // Payload shape, e.g. { id: number, iat: number, exp: number }
    const decoded = jwt.verify(token, secret) as { id: number; iat: number; exp: number };

    return { id: decoded.id }; // Return the user ID from token
  } catch (err) {
    // If invalid token or anything else fails, return null
    return null;
  }
}
