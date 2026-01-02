const express = require('express');
const bodyParser = require('body-parser');
const app =  express();
const userRoutes =  require('./routes/user.routes');

app.use(express.json());
app.use('/api/userrs',userRoutes);

module.exports = app;