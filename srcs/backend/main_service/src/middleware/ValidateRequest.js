import  { ZodError } from 'zod';
import  { HttpValidationException } from '../utils/httpExceptions.js';

const validateRequest = (schema, target = 'body') => {
    return (req,res,next) => {
        try {
            req[target] = schema.parse(req[target]);
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