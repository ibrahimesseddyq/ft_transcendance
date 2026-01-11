const userRepository = require('../repositories/userRepository')
const argon2 = require('argon2');
const {HttpException} = require('../utils/httpExceptions');

class UserService {

    async createUser(userData)
    {
        const {password, ...data} = userData;
        const passwordHash = await argon2.hash(password);
        const user = await userRepository.create({passwordHash, ...data})
        delete user.passwordHash;
        return user;
    }
    
    async getUserById(userId)
    {
        const user = await userRepository.findById(userId);
        if (!user)
            throw new HttpException(404, "User not found");
        delete user.passwordHash;
        return user;
    }

    async  getUserByEmail(email)
    {
        const user = await userRepository.findByEmail(email);
        // if (!user)
        //     throw new HttpException(404, "User not found");
        // delete user.passwordHash;
        return user;
    }

    async updateUser(userId, updateData)
    {
        await this.getUserById(userId);
        const allowedFields = ['firstName', 'lastName', 'phone', 'avatarUrl','refreshToken'];
        const filteredData = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined)
                filteredData[field] = updateData[field];
        })
        if(Object.keys(filteredData).length === 0)
            throw new HttpException(400,'No valid fields to update');
        return await userRepository.update(userId,filteredData);
    }

    async deleteUser(userId){
        await this.getUserById(userId);
        await userRepository.delete(userId);
    }

    async listUsers(filters){
        return await userRepository.findMany(filters);
    }
    
}

module.exports = new UserService();