import express from "express";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import mime from "mime-types";

const router = express.Router();
const prisma = new PrismaClient();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const authorizeUser = async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({error: "Unauthorized"});
    }
    const userId = req.session.user.id;
    const filePath = req.query.filePath;

    const entity = await prisma.entity.findFirst({
        where: {filePath, userId},
    });

    if (!entity) {
        res.status(403).json({error: "Access Denied"});
        return null;
    }

    return { filePath, entity };
}

router.get('/preview', async(req, res) => {
    const result = await authorizeUser(req, res);
    if (!result) return;

    const filePath = result.filePath;
    const { data, error} = await supabase.storage
    .from('docstack-storage')
    .createSignedUrl(filePath, 300);

    if (error || !data.signedUrl) {
        return res.status(500).json({error: error.message || "Failed to sign url"})
    }

    return res.json({url: data.signedUrl});
})

router.get('/download', async (req, res) => {
    const result = await authorizeUser(req, res);
    if (!result) return;

    const filePath = result.filePath;
    const { data, error } = await supabase.storage
    .from('docstack-storage')
    .download(filePath);

    if (error) return res.status(500).json({ error: 'Failed to fetch file' });
    
    const fileName = filePath.split('/').pop();
    const mimeType = mime.lookup(fileName) || 'application/octet-stream';
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    data.arrayBuffer().then((buffer) => {
      res.send(Buffer.from(buffer));
    });
})

router.get('/delete', async (req, res) => {
    const result = await authorizeUser(req, res);
    if (!result) return;

    const { filePath, entity } = result;

    const { data, error } = await supabase.storage
    .from('docstack-storage')
    .remove(filePath);

    const entityId = entity.id;

    await prisma.entity.delete({
        where: {id: entityId},
    });

    if (error) return res.status(500).json({error: "Failed to delete"});

    return res.status(200).json({message: "Successfully deleted"});
})

export default router;