const { PrismaClient } = require('../../generated/prisma');
let prismaInstance = null;

function getPrismaClient()
{
    if (!prismaInstance)
    {
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}

const prisma  =  getPrismaClient();

module.export = prisma;
