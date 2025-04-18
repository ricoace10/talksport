import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";


export function authenticateUser(req: NextApiRequest) {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    
    const secret = process.env.JWT_SECRET ||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTZjNTFlMWEtN2I2Ny00MjVjLTk0ZWUtYmNkMjUxOWMwNmU3IiwidGVuYW50X2lkIjoiN2EwZDhmZGZmMWNiN2VkMjFiNmEwNTIyNGEwMDEyMWRkMGM3YmYxNGRjZTdjYjY2ZTI4YTNhYzZmNzMxMmRkMSIsImludGVybmFsX3NlY3JldCI6ImIzMDQyOGE0LTIxMTktNDJiYy1iMmY2LTI5Y2YzZjJkNWIxZSJ9.Qcc7GDqiHCnssjuil-VaJL3sHWM4DZrNP2GIudnqxbg";

   
    const decoded = jwt.verify(token, secret) as { id: number; iat: number; exp: number };

    return { id: decoded.id }; 
  } catch (err) {
   
    return null;
  }
}
