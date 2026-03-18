import app from "./app.js";
import env from "./src/config/env.js"


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


const PORT = env.PORT;
const HOST = env.HOST;


process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
