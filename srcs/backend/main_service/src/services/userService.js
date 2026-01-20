const userRepository = require('../repositories/userRepository')
const argon2 = require('argon2');
const {HttpException} = require('../utils/httpExceptions');
const crypto = require('crypto');

class UserService {

    async createUser(userData)
    {
        const {password, ...data} = userData;
        const passwordHash = await argon2.hash(password);
        const user = await userRepository.create({passwordHash, ...data})
        delete user.passwordHash;
        return user;
    }

    async findUserOrCreate(profile) {
        const email = profile.emails[0].value. toLowerCase().trim();
        let user = await userRepository.findByEmail(email);
        if (user) {
        delete user.passwordHash;
        delete user.refreshToken;
        return user;
        }
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const passwordHash = await argon2.hash(randomPassword);

        user = await userRepository.create({
        email,
        firstName: profile.name.givenName || profile.displayName. split(' ')[0] || 'User',
        lastName: profile.name.familyName || profile.displayName.split(' ')[1] || '',
        passwordHash,
        avatarUrl: profile.photos?.[0]?.value || null,
        role: 'candidate',
        });

        delete user.passwordHash;
        delete user.refreshToken;
        return user;
  }
    
    async getUserById(userId)
    {
        const user = await userRepository.findById(userId);
        if (!user)
           return;
        return user;
    }

    async  getUserByEmail(email)
    {
        const user = await userRepository.findByEmail(email);
        if (!user)
           return;
        return user;
    }
    
    async updateUser(userId, updateData)
    {
        await this.getUserById(userId);
        const allowedFields = ['firstName', 'lastName', 'phone', 'avatarUrl','refreshToken', "isVerified"];
        const filteredData = {};
        
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined)
                filteredData[field] = updateData[field];
        })
        if(Object.keys(filteredData).length === 0)
            throw new HttpException(400,'No valid fields to update');
        return await userRepository.update(userId,filteredData);
    }
    
    async deleteUser(userId)
    {
        await this.getUserById(userId);
        //handle failure
        await userRepository.delete(userId);
    }
    
    async listUsers(filters){
        return await userRepository.findMany(filters);
    }
    
}

module.exports = new UserService();