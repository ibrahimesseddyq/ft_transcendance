const {z} = require('zod');
const createProfileschema =  z.object({

});


module.exports = {
    userId: z.string().uuid(36),
    linkedinUrl: z.string(),
    portfolioUrl: z.string(),
    currentCompany: z.string(),
    yearsExperience:z.number(),
}