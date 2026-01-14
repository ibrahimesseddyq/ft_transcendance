const app = require('./src/app');
const config =  require('./src/config/env');
const {prisma} = require('./src/config/prisma');

app.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`);
})
