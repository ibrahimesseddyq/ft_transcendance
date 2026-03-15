import app from "./app.js";
import env from "./src/config/env.js"


app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
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
