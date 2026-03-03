import  express from "express";
import mcqsRoutes from './src/routes/mcqRoutes.js'
import testsRoutes from './src/routes/testRoutes.js'
import internalRoutes from './src/routes/internalRoutes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/internal/tests',internalRoutes)
app.use('/api/mcqs', mcqsRoutes);
app.use('/api/tests', testsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running " });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/info", (req, res) => {
  res.json({ app: process.env.APP_NAME || "service" });
});

export default app
