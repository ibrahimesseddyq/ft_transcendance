const { z } = require('zod');

const validate = (schema) => {
    return async (req, res, next) => {
        try 
        {
            const validatedData = await schema.parseAsync(req.body);
            req.body = validatedData;
            next();
        }
        catch (error)
        {
            if (error instanceof z.ZodError)
            {
                return res.status(400).json({
                    success: false,
                    errors: (error.errors || []).map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            console.error('Validation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

module.exports = {validate};
