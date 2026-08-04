import "dotenv/config";
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "http://localhost:4000", // Frontend local (React แบบอื่น)
      "https://my-profile-eight-flax.vercel.app", // Frontend ที่ Deploy แล้ว
    ],
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

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
