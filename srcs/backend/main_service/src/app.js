const express = require('express');
const bodyParser = require('body-parser');
const app =  express();
const helmet =  require('helmet');
const cors =  require('cors');
const morgan = require('morgan');
const cokieParser =  require('cookie-parser');
const userRoutes =  require('./routes/user.routes');




app.use(helmet);

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended:true, limit : "10mb"}));
app.use(cokieParser);

app.use('/api/users',userRoutes);

module.exports = app;