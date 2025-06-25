import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.session || !req.session.user.id) {
        return res.status(401).json({error: "Unauthorized"});
    }

    const userId = req.session.user.id;
    const file = req.file;
    const filePath = `user-${userId}/${Date.now()}-${file.originalname}`;

const { data, error } = await supabase.storage
  .from('docstack-storage')
  .upload(filePath, file.buffer, {
    contentType: file.mimetype,
  });

if (error) return res.status(500).json({ error: error.message });

return res.json({ message: "File uploaded successfully", path: data?.path });

})

export default router;