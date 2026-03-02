import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cokieParser from 'cookie-parser';
import errorHandler from './middleware/ErrorHandler.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import env from './config/env.js';
import path from 'path';
import {HttpException} from './utils/httpExceptions.js';
import {verifyToken,verifyRoles} from './middleware/auth.js';
import {UserRole} from '../generated/prisma/index.js';
import  twoFARoutes from './routes/twoFARoutes.js';
import jobPhasesRoutes from './routes/jobPhaseRoutes.js'
const app =  express();

console.log(process.env.FRONTEND_URL)
console.log(env.FRONTEND_URL)
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://127.0.0.1:5173'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true 
}));

app.use(helmet());
// app.use(bodyParser(express.json));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cokieParser());
app.use(morgan('combined'));

//The cross-origin value tells the browser that it is safe to load this resource on a different port
app.use('/uploads',
  verifyToken, (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(import.meta.dirname, '../uploads')));

app.use(passport.initialize());

// routes 
app.use('/api/auth',
  authRoutes);

app.use('/api/2fa',
  verifyToken,
  twoFARoutes); 

app.use('/api/users',
  verifyToken,
  userRoutes);

app.use('/api/jobs',
  verifyToken,
  jobRoutes);

app.use('/api/profiles/',
  verifyToken,
  profileRoutes);

app.use('/api/applications',
  verifyToken,
  applicationRoutes)

app.use('/api/jobPhases',
  verifyToken
,jobPhasesRoutes)

app.use((req,res,next) => {
  next(new HttpException(404, "Route not found"));
})

app.use(errorHandler);

export default app;