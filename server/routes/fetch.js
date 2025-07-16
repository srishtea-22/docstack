import express from "express";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const prisma = new PrismaClient();
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const authorizeUser = async (req, res) => {
  if (!req.session || !req.session.user || !req.session.user.id) {
    return null;
  }
  return {user: req.session.user};
}

router.get('/', async (req, res) => {
    const result = await authorizeUser(req, res);
    if (!result) return res.status(401).json({error : "Unauthorized"});

    const userId = result.user.id;
    const parentIdParam = req.query.parentId;
    const parentId = parentIdParam === "null" || parentIdParam === undefined ? null : Number(parentIdParam);

    try {
        if (parentId !== null) {
          const folderExists = await prisma.entity.findFirst({
            where: {
              id: parentId,
              userId: userId,
              type: "FOLDER",
            },
          });
        
          if (!folderExists) {
            return res.status(404).json({ error: "Folder does not exist" });
          }
        }
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
              .from("docstack-storage");

            return {
              id: entity.id,
              name: entity.name,
              type: "FILE",
              mimeType: entity.mimeType,
              size: entity.size,
              createdAt: entity.createdAt,
              filePath: entity.filePath,
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

router.get('/entity/:id', async (req, res) => {
  const result = await authorizeUser(req, res);
  if (!result) return res.status(401).json({error : "Unauthorized"});

  const { id } = req.params;

  const entity = await prisma.entity.findUnique({
    where: {id: parseInt(id)},
    select: {id: true, name: true, parentId: true},
  });

  if (!entity) return res.status(404).json({error: "Not found"});
  res.json(entity);
})

router.get('/folderTree', async (req, res) => {
  const result = await authorizeUser(req, res);
  if (!result) return res.status(401).json({error : "Unauthorized"});

  const userId = result.user.id;

  const folders = await prisma.entity.findMany({
    where: {
      userId: userId,
       type: 'FOLDER',
      },
    select: {
      id: true,
      name: true,
      parentId: true,
    }
  });

  function buildTree(folders, parentId = null) {
    return folders
    .filter(folder => folder.parentId === parentId)
    .map(folder => ({
      ...folder,
      children: buildTree(folders, folder.id),
    }));
  };

  const folderTree = buildTree(folders);
  res.json(folderTree);
})

export default router;