const { ZodError } = require('zod');
const { HttpValidationExceptions } = require('../utils/httpExceptions')

const ValidateRequest = (schema) => {
    return (req,res,next) => {
        try
        {
            schema.parse(req.body);
            next();
        }catch (error)
        {
            if(error instanceof ZodError)
            {
                const errorMessages = err.errors.map(
                (error) => `${error.path.join(".")} is 
                ${error.message.toLowerCase()}`);
                next(new HttpValidationExceptions(errorMessages));
            }
        }
        
    }
}

module.exports =  ValidateRequest;