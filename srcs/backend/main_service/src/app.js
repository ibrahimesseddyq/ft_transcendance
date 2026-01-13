const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet =  require('helmet');
const cors =  require('cors');
const morgan = require('morgan');
const session = require('express-session');
const cokieParser =  require('cookie-parser');
const userRoutes =  require('./routes/user.routes');
const authRoutes = require('./routes/Auth.routes');
const env = require('./config/env');


app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cokieParser());
// Session middleware for using Passport
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
app.use('/api/users',userRoutes);

module.exports = app;