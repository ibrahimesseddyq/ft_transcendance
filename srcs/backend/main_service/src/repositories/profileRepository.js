const {prisma} = require('../config/prisma');

const createProfile = async (data) => {
    return await prisma.profile.create({
        data
    })
}

const deleteProfile = async (userId) => {
    return await prisma.profile.delete({
        where : {userId : userId}
    })
}

const updateProfile = async (userId, updateData) => {
    return await prisma.profile.update({
        where: {userId : userId},
        data: updateData
    })
}

const getProfileById = async (userId) => {
    return await prisma.profile.findUnique({
        where : {userId : userId}
    })
}

module.exports = {
    createProfile,
    deleteProfile,
    updateProfile,
    getProfileById
}