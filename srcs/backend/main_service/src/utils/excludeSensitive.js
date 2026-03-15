
export const getSafeUser = (user) => {
   if (!user) return null;
    const { 
        passwordHash, 
        refreshToken, 
        twoFASecret, 
        twoFATempSecret,
        ...safeUser 
    } = user;
    return safeUser;
};