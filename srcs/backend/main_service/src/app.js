import express from 'express';
import passport from './config/passport.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/ErrorHandler.js';
import path from 'path';
import env from './config/env.js';
import {HttpException} from './utils/httpExceptions.js';
import {verifyToken} from './middleware/auth.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import  twoFARoutes from './routes/twoFARoutes.js';
import jobPhasesRoutes from './routes/jobPhaseRoutes.js'
import  quizRoutes from './routes/quizRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'

const app =  express();

app.use(morgan('combined'));
app.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("--------------");
  next();
});
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true 
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      // Allow the frontend to embed /chat in an iframe
      "frame-ancestors": ["'self'", env.FRONTEND_URL],
    },
  },
  // Disable X-Frame-Options so CSP frame-ancestors takes precedence
  frameguard: false,
}));
// app.use(bodyParser(express.json));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cookieParser());

app.use('/uploads',
  verifyToken,
  (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(import.meta.dirname, '../uploads')));

app.use(passport.initialize());

// routes 
app.use('/api/main/auth',
  authRoutes);

app.use('/api/main/2fa',
  twoFARoutes); 

app.use('/api/main/users',
  verifyToken,
  userRoutes);

app.use('/api/main/jobs',
  verifyToken,
  jobRoutes);

app.use('/api/main/profiles/',
  verifyToken,
  profileRoutes);

app.use('/api/main/applications',
  verifyToken,
  applicationRoutes)

app.use('/api/main/jobPhases',
  verifyToken
,jobPhasesRoutes)

app.use('/api/main/quizzes',
  verifyToken
,quizRoutes)

app.use('/api/main/dashboard',
  verifyToken,
  dashboardRoutes);

app.use('/api/main/conversations',
  verifyToken,
  conversationRoutes);

app.use('/api/main/messages',
  verifyToken,
  messageRoutes);

app.use('/api/main/notifications',
  verifyToken,
  notificationRoutes);

app.use((req,res,next) => {
  next(new HttpException(404, "Route not found"));
})

app.use(errorHandler);

export default app;