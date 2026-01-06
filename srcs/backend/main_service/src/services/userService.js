const userRepository = require('../repositories/userRepository')
const config = require('../config/env');
const bcrypt = require('bcrypt');

class UserService {

    async createUser({email,password,first_name,last_name,role = "candidate"}) // should add more data if needed
    {
        if (password.length < 8)
            throw Error('Password must be at least 8 characters')
        const password_hash = await bcrypt.hash(password , config.BCRYPT_ROUNDS); // BCRYPT_ROUNDS should be defined in configs
        const user = await userRepository.create(
            {
                email : email.toLowerCase(),
                password_hash,
                first_name,
                last_name,
                role
            }
        )
        delete user.password;
        return user;
    }
    async getUserById(userId)
    {
        const user = await userRepository.getUserById(userId);
        if (!user)
            throw new Error("user not found");
        delete user.password;
        return user;
    }

    async updateUser(userId, updateData)
    {
        const allowedFields = ['first_name', 'last_name', 'phone', 'avatar_url'];
        const filteredData = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined)
                filteredData[field] = updateData[field];
        })
        if(Object.keys(filteredData).length === 0)
            throw new Error('No valid fields to update');
        return await userRepository.update(userId,filteredData);
    }

    async deleteUser(userId){
       await userRepository.delete(userId);
    }

    async listUsers(filters){
        return await userRepository.findMany(filters);
    }
    
}

module.exports = new UserService();