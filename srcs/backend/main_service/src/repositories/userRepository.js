import { includes } from 'zod';
import  {prisma} from '../config/prisma.js';

export const getUserById = async (userId)=> {
    return await prisma.user.findUnique({
        where : {id : userId},
          select : {
            id,
            email,
            firstName,
            lastName,
            avatarUrl
        },
        include : {
            profile : true
        }
    })
}

export const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where :{email : email },
          select : {
            id,
            role,
            email,
            firstName,
            lastName,
            avatarUrl
        },
        include : {
            profile : true
        }
    })
}


export const createUser = async (userData) => {
    return await prisma.user.create({
        data : userData,
        select : {
            id,
            email,
            firstName,
            lastName,
            avatarUrl
        }
    })
}

export const updateUser = async (userId , updateData) => {

    return await prisma.user.update({
        where : {id : userId},
        data: updateData,
        select : {
            id,
            email,
            firstName,
            lastName,
            avatarUrl
        }
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
