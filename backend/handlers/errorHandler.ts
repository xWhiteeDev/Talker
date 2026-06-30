export class ErrorHandler extends Error {
    declare readonly code: number
    declare readonly isOperational: boolean

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.name = 'ErrorHandler';
        this.isOperational = isOperational
        Object.defineProperty(this, 'code', {
            writable: false,
            configurable: false,
            value: statusCode,
            enumerable: false
        })
    }
}