const userService = require('../services/userService');

class UserControler {

    async createUser(req,res,next)
    {
        try
        {
            const {email,password,firstName,lastName,role} = req.body;
            const user = await userService.createUser({
                email,
                password,
                firstName,
                lastName,
                role
            });
            res.status(201).json({
                status : true,
                message: 'user created successfully',
                data: user
            })

        }
        catch(error)
        {
            next(error);
        }

    }
    async getUserById(req,res,next)
    {
        try {
            const user = await userService.getUserById(req.params.id);
            res.status(200).json({
                status : true,
                data : user
            })

        }catch (error)
        {
            next(error)
        }
    }
    async updateUser(req,res,next)
    {
        try{
            const user = await userService.updateUser(req.params.id,req.body);
            res.status(200).json({
                status:true,
                message:"user update successfully",
                data:user
            })
        }catch (error) {
            next(error);
        }
    }
    async deleteUser(req,res,next)
    {
        try{
            await userService.deleteUser(req.params.id);
            res.status(204).end();
        }
        catch(error)
        {
            next(error);
        }
    }
    async listUsers(req,res,next)
    {
        try {
            const {page,limit,role,search} = req.query;
            const result = await userService.listUsers({
                page:parseInt(page) || 1,
                limit:parseInt(limit) || 10,
                role,
                search
            });
            res.status(200).json({
                status: true,
                data:result
            })
        }
        catch (error)
        {
            next(error);
        }
    }
}


module.exports = new UserControler();