const { z } = require('zod');
const path =  require('path');
const fs = require('fs');
const dotenv =  require('dotenv');





dotenv.config({
  path: path.resolve(__dirname,'../../.env.dev'),
  override: true
});
const vaultFiles = ['/vault/secrets/.env.database ',
                    '/vault/secrets/.env.oauth ',
                    '/vault/secrets/.env.jw'];

// function listDirectoryTree(dir, prefix = '') {
//   const files = fs.readdirSync(dir, { withFileTypes: true });

//   files.forEach((file, index) => {
//     // Ignore heavy folders or hidden git files to keep output clean
//     if (file.name === 'node_modules' || file.name === '.git') return;

//     const isLast = index === files.length - 1;
//     const marker = isLast ? '└── ' : '├── ';
    
//     console.log(`${prefix}${marker}${file.name}`);

//     if (file.isDirectory()) {
//       const newPrefix = prefix + (isLast ? '    ' : '│   ');
//       listDirectoryTree(path.join(dir, file.name), newPrefix);
//     }
//   });
// }
// listDirectoryTree('/')

vaultFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const envConfig = dotenv.parse(fs.readFileSync(file));
    for (let k  of envConfig) {
      process.env[k] =  envConfig[k];
    }
  }
  else {
    if (process.env.NODE_ENV === "production")
      console.warn(`${file} not exists`)
  }
})


// need to add more defence for env existence and default values
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
  HOST: z.string(),
  DATABASE_URL: z.string(),
  BCRYPT_ROUNDS:  z.string().transform((val) => parseInt(val, 10)).default('10'),
  GOOGLE_CLIENT_ID : z.string(),
  GOOGLE_CLIENT_SECRET : z.string(),
  CALLBACK_URL : z.string(),
  ACCESS_TOKEN_SECRET: z.string().min(32,'Access token secret must be at least 32 characters'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'Refresh token secret must be at least 32 characters'),
  ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRY:z.string().default('7d'),
  USER_EMAIL:z.string(),
  USER_PASSWORD:z.string(),
  VERIFY_SECRET:z.string(),
  VERIFY_SECRET_EXPIRY:z.string(),
  FRONTEND_URL: z.string(),
  BACKEND_URL:z.string()
});

const envVars = envSchema.safeParse(process.env);
console.log(envVars)
if (!envVars.success) {
    console.error("❌ Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

module.exports = envVars.data;








