const express = require('express');
const app =  express();
const passport = require('passport');
const helmet =  require('helmet');
const cors =  require('cors');
const morgan = require('morgan');
const session = require('express-session');
const cokieParser =  require('cookie-parser');
const errorHandler = require('./middleware/ErrorHandler');
const userRoutes =  require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const env = require('./config/env');
const path = require('path');
const {HttpException} = require('./utils/httpExceptions');
const {verifyToken,verifyRoles} = require('./middleware/auth');
const {UserRole} = require('../generated/prisma');


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH "],
    credentials: true 
  }));
app.use(helmet());
// app.use(bodyParser(express.json));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cokieParser());
app.use(morgan('combined'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(session({
    secret: env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false
    }}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// routes 
app.use('/api/auth', authRoutes); 
app.use('/api/users',
  verifyToken,
  verifyRoles([UserRole.recruiter,UserRole.admin]),
  userRoutes);
app.use('/api/jobs',  verifyToken,
          verifyRoles([UserRole.recruiter,UserRole.admin]),
          jobRoutes); 
app.use('/api/profiles/',
  verifyToken,
  profileRoutes);
app.use((req,res,next) => {
  next(new HttpException(404, "Route not found"));
})
app.use(errorHandler);

module.exports = app;