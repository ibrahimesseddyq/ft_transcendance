const { z } = require('zod');
const path =  require('path');
const dotenv =  require('dotenv').config({
  path: path.resolve(__dirname,"../../.env.dev"),
  override: true
});


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
  REFRESH_TOKEN_EXPIRY:z.string().default('7d')

});

const envVars = envSchema.safeParse(process.env);
if (!envVars.success)
{
    console.error("❌ Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

module.exports = envVars.data;








