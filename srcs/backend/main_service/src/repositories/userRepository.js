import { includes } from 'zod';
import  {prisma} from '../config/prisma.js';

export const getUserById = async (userId)=> {
    return await prisma.user.findUnique({
        where : {id : userId},
        select : {
            id : true,
            role: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            profile : true,
            twoFATempSecret : true,
            firstLogin: true,
        }
    })
}

export const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where :{email : email },
    })
}


export const createUser = async (userData) => {
    return await prisma.user.create({
        data : userData,
        select : {
            id : true,
            role: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
        },
    })
}

export const updateUser = async (userId , updateData) => {

    return await prisma.user.update({
        where : {id : userId},
        data: updateData,
        select : {
            id : true,
            role: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
        },
    })
}

export const deleteUser = async  (userId) => {
    return await prisma.user.delete({
        where : {id : userId}
    })
}

export const getUsers = async ({skip = 0 , take = 10 , role, search }) => {
    const where = {};
    if (role) where.role = role;
    if (search) {
        where.OR = [
            {firstName: {contains: search}},
            {lastName : {contains: search}},
            {email : {contains: search}}
        ];
    }
    return await  prisma.user.findMany({
        where,
        take,
        skip,
        orderBy : {createdAt:'desc'}
    })
}
