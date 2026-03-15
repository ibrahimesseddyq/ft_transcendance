import { z } from 'zod';
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs'
const envFile = process.env.NODE_ENV === 'production' ? '../../.env' : '../../.env.example';
dotenv.config({
  path: path.resolve(import.meta.dirname,envFile),
  override: true
});

const vaultFiles = [
  '/vault/secrets/.env.database ',
  '/vault/secrets/.env.oauth ',
  '/vault/secrets/.env.jw'];

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
  ACCESS_TOKEN_SECRET: z.string().min(32,'Access token secret must be at least 32 characters'),
  FRONTEND_URL: z.string(),
  BACKEND_URL:z.string(),
  APP_NAME:z.string().min(1).default("service"),
  QUIZ_PUBLIC_API_KEY:z.string().min(32),
  INTERNAL_API_KEY: z.string().min(32)
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
    console.error("Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

export default envVars.data;
