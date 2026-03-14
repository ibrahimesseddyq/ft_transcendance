import  {z, ZodError } from 'zod';
import  { HttpValidationException } from '../utils/httpExceptions.js';

const validateRequest = (schema) => {
    return (req,res,next) => {
        try {
            req.body = schema.parse(req.body);
        } catch (error) {
            if(error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => 
                    `${issue.path.join(".")} is ${issue.message.toLowerCase()}`
                );
               return next(new HttpValidationException(errorMessages));
            }
           return next(error);
        }
        next();
        
    }
}

export default  validateRequest;