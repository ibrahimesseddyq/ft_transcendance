import { PrismaClient } from '../../generated/prisma/client.js'
import {PrismaMariaDb} from "@prisma/adapter-mariadb";
import env from './env.js'


let prismaInstance = null;

const  getPrismaClient = () => {

    if (!prismaInstance) {
        const adapter = new PrismaMariaDb(env.DATABASE_URL);
        prismaInstance = new PrismaClient({
        adapter,
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
