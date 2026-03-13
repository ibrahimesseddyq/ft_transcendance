import { z } from 'zod';
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs'

const envPath = process.env.NODE_ENV === 'production' ? "../../.env" : "../../.env.example";

dotenv.config({
  path: path.resolve(import.meta.dirname,envPath),
  override: true
});

const vaultFiles = [
];

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
  BACKEND_URL:z.string(),
  APP_NAME:z.string().min(1).default("service"),
  QUIZ_SERVICE_URL: z.string(),
  AI_INTERNAL_API_KEY:z.string(),
  INTERNAL_API_KEY: z.string(),
  AI_SERVICE_URL: z.string(),
  AI_INTERNAL_API_KEY: z.string(),  
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
    console.error("Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

export default envVars.data;
