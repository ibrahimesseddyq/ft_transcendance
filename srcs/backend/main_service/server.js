const express = require("express");
const app = require('./src/app');
const config =  require('./src/config/env');
const { process } = require("zod/v4/core");

app.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`);
})

