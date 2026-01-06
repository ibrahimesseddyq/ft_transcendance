// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const passport = require('./controllers/GoogleAuth.js');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../', '.env') });



// const app = express();
// app.use(cors({
//     origin: "http://localhost:5173", 
//     credentials: true,           
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// Session middleware for using Passport
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false }
// }));

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// const authRoutes = require('./routes/Auth.routes.js');
// app.use('/auth', authRoutes); 

// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });
// app.post('/signin', (req, res) => { 
//   console.log("req.body : " , req.body);
//   res.redirect('http://localhost:5173/dashboard');
  
// });
// app.get('/signin', (req, res) => {
//     res.send("The server is alive! But please submit the form from your React app.");
// });
// app.post('/signup', (req, res) => { 
//   console.log("req.body : ", req.body);
//   res.redirect('http://localhost:5173/dashboard');
  
// });
// app.get('/signup', (req, res) => {
//     res.send("The server is alive! But please submit the form from your React app.");
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });