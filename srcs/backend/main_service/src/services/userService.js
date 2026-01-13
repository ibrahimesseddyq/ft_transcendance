const userRepository = require('../repositories/userRepository')
const config = require('../config/env');
const bcrypt = require('bcrypt');
const { prisma } = require('../config/prisma');

const findUserOrCreate = async (profile) => {
    const nameParts = profile.displayName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return await prisma.users.upsert({
        where: { email: profile.emails?.[0]?.value },
        update: {
            first_name: firstName, 
            last_name: lastName,  
            avatar_url: profile.photos?.[0]?.value 
        },
        create: {
            email: profile.emails?.[0]?.value || '',
            first_name: firstName,
            last_name: lastName,
            avatar_url: profile.photos?.[0]?.value,
            password_hash: '',
            role: 'candidate'
        }
    });
};




class UserService {
    
    async createUser({email,password,first_name,last_name,role = "candidate"})
    {
        if (password.length < 8)
            throw Error('Password must be at least 8 characters')
        const password_hash = await bcrypt.hash(password , config.BCRYPT_ROUNDS);
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
        const user = await userRepository.findById(userId);
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

module.exports = {findUserOrCreate};
module.exports = new UserService();