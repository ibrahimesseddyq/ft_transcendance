const dotenv =  require('dotenv');
const {zod} = require('zod')
dotenv.config({path: "../../.env.dev"});

const envShcema =  zod.object({

});

const envVars = envShcema.safeParse(process.env);
if (!envVars.success)
{
    console.error(`failed to load the envirment variables`);
    exit(1);
}

module.exports = envVars.data;








