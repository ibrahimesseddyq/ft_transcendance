const {prisma} =  require('../config/prisma');


class UserRepository
{

    async findById(userId)
    {
        return await prisma.user.findUnique({
            where : {id : userId},
        })
    }

    async findByEmail(email)
    {
        return await prisma.user.findUnique(
            {
                where :{email :email }
            }
        )
    }

    async create(userData)
    {
        return await prisma.user.create(
            {
                data : userData,
            }
        )
    }


    async update(userId , updateData)
    {

        return await prisma.user.update({
            where : {id : userId},
            data: updateData,
            include : {

            }
        })
    }

    async delete (userId)
    {
        return await prisma.user.delete(
            {
                where : {id : userId}
            }
        )
    }

    async findMany({skip = 0 , take = 10 , role, search }){
        const where = {};
        if (role) where.role = role;
        if (search)
        {
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


}

const userRepository = new UserRepository();

module.exports =  userRepository;