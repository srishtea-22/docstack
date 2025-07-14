import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { Prisma, PrismaClient } from "@prisma/client";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});
const prisma = new PrismaClient();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.post('/file', upload.single('file'), async (req, res) => {
    if (!req.session || !req.session.user.id) {
        return res.status(401).json({error: "Unauthorized"});
    }

    const userId = req.session.user.id;
    const file = req.file;
    const parentId = req.body.parentId ? Number(req.body.parentId) : null;
    const filePath = `user-${userId}/${Date.now()}-${file.originalname}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('docstack-storage')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) return res.status(500).json({ error: error.message });
  
  try {
    const newEntity = await prisma.entity.create({
      data: {
        name: file.originalname,
        type: 'FILE',
        mimeType: file.mimetype,
        size: file.size,
        filePath: uploadData.path,
        userId: userId,
        parentId: parentId,
      },
    });
    return res.json({ message: "File uploaded successfully", entity: newEntity });
  }
  catch (dbError){
    console.error("database error: ", dbError);
    return res.status(500).json({error: "failed to update file in db" + dbError.message})
  }

});

router.post('/folder', async (req, res) => {
  if (!req.session || !req.session.user.id) {
    return res.status(401).json("Unauthorized");
  }

  const userId = req.session.user.id;
  const folder = req.body.folder;
  const parentId = req.body.parentId ? Number(req.body.parentId) : null;
  const folderPath = `user-${userId}/${Date.now()}-${folder}`;

  try {
    const newEntity = await prisma.entity.create({
      data: {
        name: folder,
        type: 'FOLDER',
        filePath: folderPath,
        userId: userId,
        parentId: parentId,
      },
    });

    return res.json({ message: "File uploaded successfully", entity: newEntity });
  }
  catch (err){
    console.error("error creating folder", err);
    return res.status(500).json("failed to create folder");
  }
})

export default router;