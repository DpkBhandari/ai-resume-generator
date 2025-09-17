import app from "./app.js";

const port = 5000;
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
