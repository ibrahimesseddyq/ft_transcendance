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

const gettests = async (filters) => {
    // here filters and pagination my implemented
    return await prisma.findMany({

    })
}
export {
    createTest,
    updateData,
    getTestById,
    deleteTest,
    gettests
}