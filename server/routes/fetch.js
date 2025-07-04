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

router.get('/files', async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({error : "Unauthorized"});
    }

    const userId = req.session.user.id;

    try {
        const userEntities = await prisma.entity.findMany({
            where: {
                userId: userId,
                type: 'FILE',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const filesWithURLs = userEntities.map(entity => {
            if (entity.filePath) {
                const { data } = supabase.storage
                .from('docstack-storage')
                .getPublicUrl(entity.filePath);

                return {
                    id: entity.id,
                    name: entity.name,
                    mimeType: entity.mimeType,
                    size: entity.size,
                    createdAt: entity.createdAt,
                    publicURL: data.publicUrl,
                };
            }
            return {
                id: entity.id,
                name: entity.name,
                mimeType: entity.mimeType,
                size: entity.size,
                createdAt: entity.createdAt,
                publicURL: null,
            };
        });

        return res.json(filesWithURLs);
    }
    catch (error){
        console.error("error fetching files", error);
        return res.status(500).json({error: "failed to fetch files"});
    }
});

export default router;