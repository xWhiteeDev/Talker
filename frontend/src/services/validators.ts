import type {IValidators} from "./routes/authService.ts"
export function validateLength(value: string, rules: IConfigLength): boolean {
    return value.length <= rules.max && value.length >= rules.min
}

export function validateTrim(value: string, rules: boolean): boolean {
    return rules ? value.trim().length !== 0 : true
}

export function validateRegex(value: string, rules: RegExp): boolean {
    return rules.test(value)
}
export const validatorFunctions: IValidators = {
    trim: validateTrim,
    length: validateLength,
    regex: validateRegex
}