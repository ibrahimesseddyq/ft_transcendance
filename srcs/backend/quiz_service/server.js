import app from "./app.js";
import env from "./src/config/env.js"

app.get("/", (req, res) => {
  res.json({ message: "Server is running " });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/info", (req, res) => {
  res.json({ app: env.APP_NAME});
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


const PORT = env.PORT;
const HOST = env.HOST;

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
