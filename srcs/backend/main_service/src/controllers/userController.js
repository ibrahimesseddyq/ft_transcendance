const userService = require('../services/userService');

class UserControler {
    async createUser(req,res,next)
    {
        try
        {
            const {email,password,first_name,last_name,role} = req.body;
            const user = await userService.createUser({
                email,
                password,
                first_name,
                last_name,
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
            const {id} = req.params;
            const user = await userService.getUserById(id);
            res.status(200).json({
                status : true,
                data : user
            })

        }catch (error)
        {
            next(error)
        }
    }
    async udateUser(req,res,next)
    {
        try{
            const {id} = req.params;
            const updateData =  req.body;
            const user = await userService.updateUser(id,updateData);
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
            const {id} = req.params;
            await userService.deleteUser(id);
            res.status(200).json({
                status:true,
                message:"user deleted successfully"
            })
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