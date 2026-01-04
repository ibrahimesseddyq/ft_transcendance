const { PrismaClient } = require('../../generated/prisma'); 
const config = require('./env')
let prismaInstance = null;

const  getPrismaClient = () =>
{
    if (!prismaInstance)
    {
        prismaInstance = new PrismaClient({
        log: [
        { level: 'query', emit:  'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'info', emit: 'stdout' } 
      ],
       errorFormat: 'pretty'
    });
    }
    return prismaInstance;
}

const   disconnect = async () =>
{
    if (prismaInstance)
    {
        await prismaInstance.$disconnect();
        prismaInstance = null;

    }
}

const prisma  =  getPrismaClient();

module.exports = {prisma , disconnect };
