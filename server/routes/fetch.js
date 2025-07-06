import express from "express";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import e from "express";
import { join } from "@prisma/client/runtime/library";

const router = express.Router();
const prisma = new PrismaClient();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.get('/', async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({error : "Unauthorized"});
    }

    const userId = req.session.user.id;
    const parentId = req.query.parentId ? Number(req.query.parentId) : null;

    try {
        const userEntities = await prisma.entity.findMany({
            where: {
                userId: userId,
                parentId: parentId === "null" ? null : parentId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const result = userEntities.map((entity) => {
          if (entity.type === "FILE") {
            const { data } = supabase.storage
              .from("docstack-storage")
              .getPublicUrl(entity.filePath);

            return {
              id: entity.id,
              name: entity.name,
              type: "FILE",
              mimeType: entity.mimeType,
              size: entity.size,
              createdAt: entity.createdAt,
              publicURL: data.publicUrl,
            };
          }

          return {
            id: entity.id,
            name: entity.name,
            type: "FOLDER",
            createdAt: entity.createdAt,
          };
        });

        return res.json(result);
    }
    catch (error){
        console.error("error fetching files", error);
        return res.status(500).json({error: "failed to fetch files"});
    }
});

export default router;