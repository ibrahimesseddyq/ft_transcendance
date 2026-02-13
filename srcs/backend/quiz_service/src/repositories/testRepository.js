import  {prisma} from '../config/prisma.js'

const createTest = async (testData) => {
    return await prisma.test.create({
        testData
    })
}

const updateData = async (testId, updateData) => {
    return await prisma.test.update({
        where: {id : testId},
        data: updateData
    })
}

const getTestById = async (testId) => {
    return await prisma.findUnique({
        where: {id : testId}
    })
}

const deleteTest = async (testId) => {
    return await prisma.test.delete({
        where: {id : testId}
    })
}

const gettests = async (skip = 0, take = 10, filters = []) => {
    // here filters and pagination my implemented
    return await prisma.findMany({
        skip,
        take,
        filters
    })
}
export {
    createTest,
    updateData,
    getTestById,
    deleteTest,
    gettests
}