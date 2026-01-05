const {prisma} =  require('../config/prisma');


class UserRepository
{
    async create(userData)
    {
        return await prisma.users.create(
            {
                data : userData,
            }
        )
    }

    async findById(userId)
    {
        return await prisma.users.findUnique({
            where : {id : userId},
            include: {}
        })
    }

    async findByEmail(email)
    {
        return await prisma.users.findUnique(
            {
                where :{email :email }
            }
        )
    }

    async update(userId , updateData)
    {
        return await prisma.users.update({
            where : {id : userId},
            data: updateData,
            include : {

            }
        })
    }

    async delete (userId)
    {
        return await prisma.users.delete(
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
                {first_name: {contains: search}},
                {last_name : {contains: search}},
                {email : {contains: search}}
            ];
        }
        return await  prisma.users.findMany({
            where,
            take,
            skip,
            orderBy : {created_at:'desc'}
        })

    }


}

const userRepository = new UserRepository();

module.exports =  userRepository;