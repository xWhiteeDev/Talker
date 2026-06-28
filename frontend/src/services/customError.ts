export class CustomError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message)
        this.name = 'Custom Error'
    }
}