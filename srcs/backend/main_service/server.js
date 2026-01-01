const express = require("express");
const app = require('./src/app');
const config =  require('./src/config/env');

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
});
