import express from "express";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.get('/preview', async(req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({error : "Unauthorized"});
    }
    const userId = req.session.user.id;
    const filePath = req.query.filePath;

    const entity = await prisma.entity.findFirst({
        where: {filePath, userId},
    });

    if (!entity) return res.status(403).json({error: "Acess Denied"});

    const { data, error} = await supabase.storage
    .from('docstack-storage')
    .createSignedUrl(filePath, 300);

    if (error || !data.signedUrl) {
        return res.status(500).json({error: error.message || "Failed to sign url"})
    }

    return res.json({url: data.signedUrl});
})

export default router;