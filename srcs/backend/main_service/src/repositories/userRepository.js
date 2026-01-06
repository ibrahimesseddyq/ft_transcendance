const {prisma} =  require('../config/prisma');


class UserRepository
{

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

    async create(userData)
    {
        if (!await this.findByEmail(userData.email))
        {
            return await prisma.users.create(
                {
                    data : userData,
                }
            )
        }
        else
            return new Error("user alredy eists");
    }


    async update(userId , updateData)
    {
        if (await this.findById(userId))
        {
            return await prisma.users.update({
                where : {id : userId},
                data: updateData,
                include : {
    
                }
            })
        }
        else
            return new Error("user not found");
    }

    async delete (userId)
    {
        if (await this.findById(userId))
        {
            return await prisma.users.delete(
               {
                   where : {id : userId}
               }
            )
        }
        else
            return new Error("user does not exists");
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