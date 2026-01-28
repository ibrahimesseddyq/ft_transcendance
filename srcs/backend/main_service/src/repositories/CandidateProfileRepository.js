const prisma = require('../config/prisma');

const createCandidateProfile = async (data) => {
    return await prisma.candidateprofile.create({
        data:data
    })
}

const deleteCandidateProfile = async (candidateProfileId) => {
    return await prisma.candidateprofile.delete({
        where : {id : candidateProfileId}
    })
}

const updateCandideateProfile = async (candidateProfileId, updateData) => {
    return await prisma.candidateprofile.update({
        where: {id : candidateProfileId},
        data: updateData
    })
}

const getCandidateProfileById = async (candidateProfileId) => {
    return await prisma.candidateprofile.findUnique({
        where : {id : candidateProfileId}
    })
}

module.exports = {
    createCandidateProfile,
    deleteCandidateProfile,
    updateCandideateProfile,
    getCandidateProfileById
}