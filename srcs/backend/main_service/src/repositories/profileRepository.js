import {prisma} from '../config/prisma.js';

export const createProfile = async (data) => {
    return await prisma.profile.create({
        data,
         include: {
            user: {
                select: {
                    avatarUrl: true,
                },
            },
        },
    })
}

export const deleteProfile = async (userId) => {
    return await prisma.profile.delete({
        where : {userId : userId}
    })
}

export const updateProfile = async (userId, updateData) => {
    return await prisma.profile.update({
        where: { userId: userId },
        data: updateData,
        include: {
            user: {
                select: {
                    avatarUrl: true,
                },
            },
        },
    });
};

export const getProfileById = async (userId) => {
    return await prisma.profile.findUnique({
        where : {userId : userId},
        include: {
            user : true
        }
    })
}
