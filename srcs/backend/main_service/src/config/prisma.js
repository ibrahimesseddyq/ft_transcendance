import { PrismaClient } from '../../generated/prisma';

let prismaInstance = null;

const  getPrismaClient = () => {
    if (!prismaInstance) {
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

export const   disconnect = async () => {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        prismaInstance = null;
    }
}

export const prisma  =  getPrismaClient();

