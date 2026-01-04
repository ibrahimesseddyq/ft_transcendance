const prisma =  require('../config/prisma');


class UserRepository
{
    async create(userData)
    {
        return await prisma.user.create(
            {
                data : userData,
                include : {
                    
                }
            }
        )
    }
    async findById(userId)
    {
        return await prisma.user.findUniqe({
            where : {id : userId},
            include: {}
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

    async findMany({ page = 1, limit = 10, role, search }){
        const where = {};
        if (role) where.role = role;
        if (search)
        {
            where.OR = [
                {first_name: {contains: search}},
                {lastt_name : {contains: search}},
                {email : {conatins: search}}
            ];
        }
        return await  prisma.user.findMany({
            where,
            page,
            limit,
            orderBy : {created_at:' desc'}
        })

    }


}

const userRepository = new UserRepository();
module.exports =  userRepository;