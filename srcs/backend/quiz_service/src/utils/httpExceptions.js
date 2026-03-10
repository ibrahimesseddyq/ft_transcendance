class CustomError extends Error {
    constructor(message , statusCode = 500,errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors.length ? errors : [message];
    }
}

class HttpException extends CustomError {
    constructor(message = 'Something went wrong',statusCode = 500) {
        super(message,statusCode,[message])
    }
}

class HttpValidationException extends  CustomError {
    constructor(errors = ['Bad Request']) {
        super('Bad Request',400);
    }
}

export {
    CustomError,
    HttpException,
    HttpValidationException
}