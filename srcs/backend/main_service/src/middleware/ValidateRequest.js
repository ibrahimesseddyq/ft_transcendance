import  {z, ZodError } from 'zod';
import  { HttpValidationException } from '../utils/httpExceptions.js';

const validateRequest = (schema, target = 'body') => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[target]);
            req[target] = parsed;
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map(i => `${i.path.join('.')} is ${i.message.toLowerCase()}`);
                return next(new HttpValidationException(messages));
            }
            return next(error);
        }
        next();
    };
};

export default  validateRequest;