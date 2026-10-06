
export class EmitError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.name = 'EmitError';
        this.message = message;
        this.statusCode = statusCode;
    }
}