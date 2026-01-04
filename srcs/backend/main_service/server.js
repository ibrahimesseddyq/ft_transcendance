const express = require("express");
const app = require('./src/app');
const config =  require('./src/config/env');

app.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`);
})
