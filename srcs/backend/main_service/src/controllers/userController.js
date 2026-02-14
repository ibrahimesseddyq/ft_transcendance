import * as userService from '../services/userService';

export const createUser =  async (req,res,next) => {
    try {
        const {email,password,firstName,lastName,role} = req.body;
        const user = await userService.createUser({
            email,
            password,
            firstName,
            lastName,
            role
        });
        res.status(201).json({
            success: true,
            message: 'user created successfully',
            data: user
        })

    }
    catch(error){
        next(error);
    }

}

export const getUserById = async (req,res,next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data : user
        })

    }catch (error){
        next(error)
    }
}
export const updateUser = async (req,res,next) => {
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
export const deleteUser = async (req,res,next) => {
    try{
        await userService.deleteUser(req.params.id);
        res.status(204).end();
    }
    catch(error) {
        next(error);
    }
}
export const listUsers = async (req,res,next) => {
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
    catch (error) {
        next(error);
    }
}
export const deleteAvatar =  async (req, res, next) => {
    try {
        await userService.detletAvatar(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error)
    }
}

export const uploadAvatar = async(req, res, next) => {
    try {
        const avatar = await userService.uploadAvatar(req.params.id, req.file);
        res.status(201)
        .json({
            success: true,
            message: 'avatar uploaded successfully',
            data: avatar
        })
    } catch (error) {
        next(error)
    }
}

export const getAvatar = async (req, res, next) => {
    try {
        const avatar =  await userService.getAvatar(req.params.id);
        res.status(200)
        .json({
            success: true,
            data: avatar
        })
    } catch (error) {
        next(error)
    }
}
