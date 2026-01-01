const { PrismaClient } = require('../../generated/prisma');
let prismaInstance = null;

const  getPrismaClient = () =>
{
    if (!prismaInstance)
    {
        prismaInstance = new PrismaClient();
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
