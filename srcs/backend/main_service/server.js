import app from './src/app.js';
import env from './src/config/env.js';
import {prisma} from './src/config/prisma.js';

app.listen(env.PORT, () => {
  console.log(`Server running on port http://${env.HOST}:${env.PORT}`);
})
