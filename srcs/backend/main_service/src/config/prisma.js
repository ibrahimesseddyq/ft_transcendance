import { PrismaClient } from '../../generated/prisma/client.js'
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import env from './env.js'

let prismaInstance = null;

const getPrismaClient = () => {
    if (!prismaInstance) {
        const adapter = new PrismaMariaDb(env.DATABASE_URL);
        prismaInstance = new PrismaClient({
            adapter,
            log: [
                { level: 'query', emit: 'event' },
                { level: 'error', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
                { level: 'info', emit: 'stdout' }
            ],
            errorFormat: 'pretty'
        });
    }
    return prismaInstance;
}

export const disconnect = async () => {
    if (prismaInstance) {
        await prismaInstance.$disconnect();
        prismaInstance = null;
    }
}

export const prisma = getPrismaClient();
