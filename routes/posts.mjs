import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateUpdatePost } from "../utils/postValidation.mjs";

const postsRouter = Router();

postsRouter.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const category = req.query.category;
    const keyword = req.query.keyword;
    const offset = (page - 1) * limit;

    const values = [];
    let whereClause = "where 1=1";

    if (category) {
      values.push(category);
      whereClause += ` and categories.name = $${values.length}`;
    }

    if (keyword) {
      values.push(`%${keyword}%`);
      const keywordIndex = values.length;
      whereClause += ` and (posts.title ilike $${keywordIndex} or posts.description ilike $${keywordIndex} or posts.content ilike $${keywordIndex})`;
    }

    const countResult = await connectionPool.query(
      `select count(*) from posts
       inner join categories on posts.category_id = categories.id
       inner join statuses on posts.status_id = statuses.id
       ${whereClause}`,
      values
    );

    const totalPosts = Number(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit) || 0;

    const postsResult = await connectionPool.query(
      `select
         posts.id,
         posts.image,
         categories.name as category,
         posts.title,
         posts.description,
         posts.date,
         posts.content,
         statuses.status,
         posts.likes_count
       from posts
       inner join categories on posts.category_id = categories.id
       inner join statuses on posts.status_id = statuses.id
       ${whereClause}
       order by posts.date desc
       limit $${values.length + 1}
       offset $${values.length + 2}`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      totalPosts,
      totalPages,
      currentPage: page,
      limit,
      posts: postsResult.rows,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postsRouter.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await connectionPool.query(
      `select
         posts.id,
         posts.image,
         categories.name as category,
         posts.title,
         posts.description,
         posts.date,
         posts.content,
         statuses.status,
         posts.likes_count
       from posts
       inner join categories on posts.category_id = categories.id
       inner join statuses on posts.status_id = statuses.id
       where posts.id = $1`,
      [postId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch {
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

postsRouter.put("/:postId", validateUpdatePost, async (req, res) => {
  const postId = req.params.postId;
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const result = await connectionPool.query(
      `update posts
       set title = $2,
           image = $3,
           category_id = $4,
           description = $5,
           content = $6,
           status_id = $7
       where id = $1`,
      [postId, title, image, category_id, description, content, status_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({
      message: "Updated post sucessfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

postsRouter.delete("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await connectionPool.query(
      `delete from posts where id = $1`,
      [postId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({
      message: "Deleted post sucessfully",
    });
  } catch {
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

export default postsRouter;
