const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/profile", (req, res) => {
  res.status(200).json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
