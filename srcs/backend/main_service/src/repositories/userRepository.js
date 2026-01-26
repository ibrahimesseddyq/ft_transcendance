const {prisma} =  require('../config/prisma');

const getUserById = async (userId)=>
{
    return await prisma.user.findUnique({
        where : {id : userId},
    })
}

const getByEmail = async (email) =>
{
    return await prisma.user.findUnique(
        {
            where :{email :email }
        }
    )
}

const createUser = async (userData) =>
{
    return await prisma.user.create(
        {
            data : userData,
        }
    )
}

const updateUser = async (userId , updateData) =>
{

    return await prisma.user.update({
        where : {id : userId},
        data: updateData,
        include : {

        }
    })
}

const deleteUser = async  (userId) =>
{
    return await prisma.user.delete(
        {
            where : {id : userId}
        }
    )
}

const getUsers = async ({skip = 0 , take = 10 , role, search })=>
{
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

module.exports =  {
    getUserById,
    getByEmail,
    createUser,
    updateUser,
    deleteUser,
    getUsers
};