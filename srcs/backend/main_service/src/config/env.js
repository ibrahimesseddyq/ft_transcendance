const dotenv =  require('dotenv');
const { z } = require('zod');
const path =  require('path');

dotenv.config({path: path.resolve(__dirname,"../../.env.dev") });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
  DATABASE_URL: z.string()
});

const envVars = envSchema.safeParse(process.env);
if (!envVars.success)
{
    console.error("❌ Invalid environment variables:", envVars.error.format());
    process.exit(1);
}

module.exports = envVars.data;








