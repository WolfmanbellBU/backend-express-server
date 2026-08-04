import "dotenv/config";
import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/assignments", async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  if (
    !title ||
    !image ||
    !category_id ||
    !description ||
    !content ||
    !status_id
  ) {
    return res.status(400).json({
      message:
        "Server could not create post because there are missing data from client",
    });
  }

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
