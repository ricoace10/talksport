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
        
        
        return res.status(405).json({
          success: false,
          message: "GET not implemented. Use /api/posts for listing all posts.",
        });

      case "PUT": {
       
        const { caption } = req.body;

        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { caption },
         
          include: { likes: true, author: true },
        });

        return res.status(200).json({
          success: true,
          data: updatedPost,
        });
      }

      case "DELETE": {
        
        await prisma.post.delete({
          where: { id: postId },
        });
        return res.status(200).json({
          success: true,
          message: "Post deleted.",
        });
      }

      default:
       
        return res.status(405).json({
          success: false,
          message: "Method not allowed.",
        });
    }
  } catch (error) {
   
    console.error("[POST /id] Error:", error);

    
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      code: "ERR_INVALID_ARG_TYPE",
      page: "/api/posts/[id]",
    });
  }
}
