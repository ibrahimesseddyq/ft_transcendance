const userRepository = require('../repositories/userRepository')
const argon2 = require('argon2');

class UserService {

    async createUser({email,password,first_name,last_name,role = "candidate"}) // should add more data if needed
    {
        if (!password || password.length < 8)
            throw new HttpException(400,'Password must be at least 8 characters');
        const password_hash = await argon2.hash(password);
        const user = await userRepository.create(
            {
                email : email.toLowerCase(),
                password_hash,
                first_name,
                last_name,
                role
            }
        )
        delete user.password_hash;
        return user;
    }
    
    async getUserById(userId)
    {
        const user = await userRepository.findById(userId);
        if (!user)
            throw new HttpException(404, "User not found");
        delete user.password_hash;
        return user;
    }

    async updateUser(userId, updateData)
    {
        await this.getUserById(userId);
        const allowedFields = ['first_name', 'last_name', 'phone', 'avatar_url'];
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