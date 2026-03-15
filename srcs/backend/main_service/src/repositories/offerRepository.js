import {prisma} from '../config/prisma.js'

export const createOffer = async (date) => {
    return await prisma.offer.create({
        data: data
    });
}

export const updateOffer = async (offerId,data) => {
    return await prisma.offer.update({
        where : {id : offerId},
        data : data
    })
}

export const deleteOffer = async (offerId) => {
    return await prisma.offer.delete({
        where: {id : offerId}
    })
}

export const getOfferById = async (offerId) => {
    return await prisma.offer.findUnique({
        where : { id : offerId}
    })
}

export const getOffers = async () => {
    return await prisma.offer.findMany({
        
    })
}