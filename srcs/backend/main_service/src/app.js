const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet =  require('helmet');
const cors =  require('cors');
const morgan = require('morgan');
const session = require('express-session');
const cokieParser =  require('cookie-parser');
const errorHandler = require('./middleware/ErrorHandler');
const userRoutes =  require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const env = require('./config/env');
const {HttpException} = require('./utils/httpExceptions')



app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,           
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cokieParser());
// --- ADD THIS SECTION ---

// 1. Create a token named 'body' to parse the request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

// 2. Use morgan with a custom format string including the ':body' token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// --- END SECTION ---
// Session middleware for using Passport
app.use(session({
    secret: env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false // true only in HTTPS
    }}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/api/auth', authRoutes); 
app.use('/api/users',userRoutes);

app.use((req,res,next) => {
  next(new HttpException(404, "Route not found"));
})
app.use(errorHandler);

module.exports = app;