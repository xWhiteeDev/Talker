export class ErrorHandler extends Error {
    declare readonly code: number
    constructor(message: string, code: number) {
        super(message)
        this.name = 'ErrorHandler';
        Object.defineProperty(this, 'code', {
            writable: false,
            enumerable: false,
            value: code,
            configurable: false
        })
    }
}