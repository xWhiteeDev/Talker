import { getPersonAgeByDate } from "../../../utils/getPersonAge";
import type { ConfigurationLength, ValidationFunctions } from "./types";

export function validateLength(value: string, rules: ConfigurationLength): boolean {
    return value.length <= rules.max && value.length >= rules.min
}

export function validateTrim(value: string, rules: boolean): boolean {
    return rules ? value.trim().length !== 0 : true
}

export function validateRegex(value: string, rules: RegExp): boolean {
    return rules.test(value)
}

export const validatorFunctions: ValidationFunctions = {
    trim: validateTrim,
    length: validateLength,
    regex: validateRegex,
    minimalAge: validateAge
}

export function validateAge(date: string, rule: number): boolean {
    const personAge = getPersonAgeByDate(date);
    if (!personAge) return false
    return personAge >= rule
}