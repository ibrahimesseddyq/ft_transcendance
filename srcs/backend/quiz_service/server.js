import app from "./app.js";
import env from "./src/config/env.js"


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


const PORT = env.PORT;
const HOST = env.HOST;

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
