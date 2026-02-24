import { includes } from 'zod'
import  {prisma} from '../config/prisma.js'
import { TestType } from '../../generated/prisma/index.js'

export const createTest = async (testData) => {
    return await prisma.test.create({
        data : {
           type:  testData.type,
           title: testData.title,
           description: testData.description,
           durationMinutes: testData.durationMinutes,
           passingScore: testData.passingScore,
           category: testData.category,
           difficulty: testData.difficulty,
           tags: testData.tags,
           isPublished: false,
           ...(testData.type === TestType.QUIZ &&
           {mcqs : {
            connect : mcqsIds.map(id => ({id}))
           }}),
           ...(testData.type === TestType.CODE && {
                codeChallenges : {
                    connect : {id : codeChallengeId} 
                }
           })
        },
        include: {
            mcqs : testData.type === TestType.QUIZ,
            codeChallenges : testData.type === TestType.CODE
        }
    })
}

export const updateData = async (testId, updateData) => {
    const { mcqIds, codeChallengeId, ...data } = updateData;
    return await prisma.test.update({
        where: {id : testId},
        data: {
            ...data,
            ...(mcqIds && {
                mcqs :{
                    set : mcqIds.map(id => ({id}))
                }
            }),
            ...(codeChallengeId && {
                set : [{id : codeChallengeId}]
            })
        },
        include : {
            mcqs : true,
            codeChallenges: true
        }
    })
}

export const getTestById = async (testId) => {
    return await prisma.test.findUnique({
        where: {id : testId},
        include : {
            mcqs : true,
            codeChallenges: true
        }
    })
}

export const deleteTest = async (testId) => {
    return await prisma.test.delete({
        where: {id : testId}
    })
}

export const gettests = async (skip = 0, take = 10, filters = {}) => {
    // here filters and pagination my implemented
    return await prisma.test.findMany({
        where : {},
        skip,
        take,
        include: {
            mcqs: true,
            codeChallenges: true
        }
    })
}
