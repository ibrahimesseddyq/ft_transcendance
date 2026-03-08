
export const getSafeUser = (user) => {
   if (!user) return null;
    const { 
        passwordHash, 
        refreshToken, 
        twoFASecret, 
        twoFATempSecret,
        firstLogin,
        ...safeUser 
    } = user;
    return safeUser;
};