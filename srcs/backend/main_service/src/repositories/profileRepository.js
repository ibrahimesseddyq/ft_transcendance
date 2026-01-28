const prisma = require('../config/prisma');

const createProfile = async (data) => {
    return await prisma.profile.create({
        data:data
    })
}

const deleteProfile = async (ProfileId) => {
    return await prisma.profile.delete({
        where : {id : ProfileId}
    })
}

const updateProfile = async (ProfileId, updateData) => {
    return await prisma.profile.update({
        where: {id : ProfileId},
        data: updateData
    })
}

const getProfileById = async (ProfileId) => {
    return await prisma.profile.findUnique({
        where : {id : ProfileId}
    })
}

module.exports = {
    createProfile,
    deleteProfile,
    updateProfile,
    getProfileById
}