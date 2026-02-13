import { PrismaClient } from '../../generated/prisma';
import { PrismaMysql } from '@prisma/adapter-mysql';
import mysql from 'mysql2/promise';

let prismaInstance = null;

const  getPrismaClient = () => {

    if (!prismaInstance) {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        const adapter = new PrismaMysql(pool);
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
