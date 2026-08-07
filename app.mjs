import "dotenv/config";
import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.mjs";
import assignmentsRouter from "./routes/assignments.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5174", // Frontend local (Vite)
      "http://localhost:4000", // Frontend local (React แบบอื่น)
      "https://my-profile-eight-flax.vercel.app", // Frontend ที่ Deploy แล้ว
    ],
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/posts", postsRouter);
app.use("/assignments", assignmentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
