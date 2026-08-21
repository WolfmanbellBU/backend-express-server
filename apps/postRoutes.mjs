// apps/postRoutes.mjs
import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import protectAdmin from "../middlewares/protectAdmin.mjs";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import { validateCreatePost } from "../utils/postValidation.mjs";
// เชื่อมต่อ Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const postRouter = Router();
// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const multerUpload = multer({ storage: multer.memoryStorage() });
// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);
// Route สำหรับการสร้างโพสต์ใหม่
// validation อยู่ก่อน auth เพื่อให้ Postman ยิงข้อมูลผิดแล้วได้ 400 โดยไม่ต้องมี token
postRouter.post(
  "/",
  [imageFileUpload, validateCreatePost, protectAdmin],
  async (req, res) => {
    try {
      const newPost = req.body;
      const file = req.files?.imageFile?.[0];
      let imageUrl = newPost.image;

      if (file) {
        const bucketName = "my-personal-blog";
        const filePath = `posts/${Date.now()}_${file.originalname}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });
        if (error) {
          throw error;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(data.path);
        imageUrl = publicUrl;
      }

      const result = await connectionPool.query(
        `INSERT INTO posts (title, image, category_id, description, content, status_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          newPost.title,
          imageUrl,
          newPost.category_id,
          newPost.description,
          newPost.content,
          newPost.status_id,
        ]
      );

      return res.status(201).json({
        message: "Created post successfully",
        id: result.rows[0].id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Server could not create post",
        error: err.message,
      });
    }
  }
);
export default postRouter;
