import { PrismaClient } from '../../generated/prisma';

let prismaInstance = null;

const  getPrismaClient = () => {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient({
        log: [],
       errorFormat: 'pretty'
    });
    }
    return prismaInstance;
}

const   disconnect = async () => {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        prismaInstance = null;
    }
}

const prisma  =  getPrismaClient();

export {
    prisma,
    disconnect
};
