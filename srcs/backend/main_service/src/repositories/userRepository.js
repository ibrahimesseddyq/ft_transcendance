const prisma =  require('../config/prisma');


class UserRepository
{
    async create(userData)
    {
        return await prisma.user.create(
            {
                data : userData,
                inclules : {
                    
                }
            }
        )
    }
    async findById(userId)
    {
        return await prisma.user.findUniqe({
            where : {id : userId},
            inclule: {}
        })
    }

    async findByEmail(email)
    {
        return await prisma.user.findUniqe(
            {
                where :{email :email }
            }
        )
    }

    async update(userId , updateData)
    {
        return await prisma.user.update({
            where : {id : userId},
            data: userData,
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

    }


}

const userRepository = new UserRepository();
module.exports =  userRepository;