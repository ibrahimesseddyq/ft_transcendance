class CustomError extends Error {
    constructor(message , statusCode = 500,errors = [], isLogging = false) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors.length ? errors : [message];
        this.isLogging = isLogging;
    }
}

class HttpException extends CustomError {
    constructor(statusCode = 500, message = 'Something went wrong',isLogging = false) {
        super(message,statusCode,[message],isLogging)
    }
}

class HttpValidationException extends  CustomError {
    constructor(errors = ['Bad Request'], isLogging = false) {
        super(400,'Bad Request',errors,isLogging);
    }
}

export {
    CustomError,
    HttpException,
    HttpValidationException
}