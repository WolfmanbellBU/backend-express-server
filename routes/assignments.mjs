import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validatePostBody } from "../utils/postValidation.mjs";

const assignmentsRouter = Router();

assignmentsRouter.post("/", validatePostBody, async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    await connectionPool.query(
      `insert into posts (title, image, category_id, description, content, status_id, date)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        new Date(),
      ]
    );

    return res.status(201).json({
      message: "Created post sucessfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

export default assignmentsRouter;
