/**
 * Validation middleware สำหรับ POST /assignments และ PUT /posts/:postId
 *
 * ลำดับการเช็คแต่ละฟิลด์:
 * 1) ไม่ถูกส่งมา (undefined / null) → "{Field} is required"
 * 2) type ไม่ตรง → "{Field} must be a string|number"
 */
export function validatePostBody(req, res, next) {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  // --- title ---
  if (title === undefined || title === null) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  // --- image ---
  if (image === undefined || image === null) {
    return res.status(400).json({ message: "Image is required" });
  }
  if (typeof image !== "string") {
    return res.status(400).json({ message: "Image must be a string" });
  }

  // --- category_id ---
  if (category_id === undefined || category_id === null) {
    return res.status(400).json({ message: "Category id is required" });
  }
  if (typeof category_id !== "number") {
    return res.status(400).json({ message: "Category id must be a number" });
  }

  // --- description ---
  if (description === undefined || description === null) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  // --- content ---
  if (content === undefined || content === null) {
    return res.status(400).json({ message: "Content is required" });
  }
  if (typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a string" });
  }

  // --- status_id ---
  if (status_id === undefined || status_id === null) {
    return res.status(400).json({ message: "Status id is required" });
  }
  if (typeof status_id !== "number") {
    return res.status(400).json({ message: "Status id must be a number" });
  }

  // ผ่านทุกเงื่อนไข → ไป handler ถัดไป
  next();
}
