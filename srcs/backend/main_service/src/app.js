const express = require('express');
const bodyParser = require('body-parser');
const app =  express();

const PORT = process.env.MAIN_SERVICE_PORT || 3000;


app.listen(PORT, () => {

});